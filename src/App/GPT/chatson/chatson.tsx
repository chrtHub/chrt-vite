import { getUnixTime } from "date-fns";
import axios from "axios";
import { produce } from "immer";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";

import { getUserDbId } from "../../../Util/getUserDbId";
import { isValidUUIDV4, getUUIDV4 } from "../../../Util/getUUIDV4";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
  IAPIResponse,
  IConversation,
  IMessage,
  IModel,
  IChatCompletionRequestBody,
  UUIDV4,
} from "./chatson_types";
import { tiktoken } from "./tiktoken";
import { ObjectId } from "bson";

/**
 * Causes an LLM API call after adding a propmt to a chatson object
 *
 * @param access_token (a) set as the author id, (b) sent as Bearer token in 'authorization' header
 * @param message user input to be added to the conversation
 * @param version_of When null, the message becomes the next message in the conversation. When specified, the message becomes the next version for the specified order.
 * @param model LLM model to be used
 * @param conversation When null, the server creates a new conversation. Otherwise, the message is added to the conversation.
 * @param setConversation state setter for the conversation
 * @returns IChatsonObject updated with the new prompt
 */
export async function send_message(
  access_token: string,
  message: string,
  version_of: number | null,
  model: IModel,
  conversation: IConversation,
  setConversation: React.Dispatch<React.SetStateAction<IConversation>>
) {
  console.log(" ----- SEND MESSAGE ----- "); // DEV
  console.log("conversation: ", conversation); // DEV

  //-- Get user_db_id from access token --//
  let user_db_id = getUserDbId(access_token);

  //-- If conversation.user_db_id unset, set it --//
  if (conversation.user_db_id === "dummy_user_db_id") {
    setConversation(
      produce((draft) => {
        draft.user_db_id = user_db_id;
      })
    );
  }

  //-- Crete new message object --//
  let new_message: IMessage = {
    message_uuid: getUUIDV4(),
    author: user_db_id,
    model: model,
    created_at: new Date(),
    role: "user",
    message: message,
  };

  //- Immer - add new_message and its order to conversation --//
  setConversation(
    produce((draft) => {
      draft.messages[new_message.message_uuid] = new_message;
      draft.message_order[maxOrder + 1] = { 1: new_message.message_uuid };
    })
  );

  //-- Fetch Event Source for Chat Completions Request --//
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  const body: IChatCompletionRequestBody = {
    _id: conversation._id,
    new_message: new_message,
    version_of: version_of, // TO ADD - if order specified, message will become the next version (possibly 1) for that order
    model: model,
  };

  let res_uuid_to_validate: string;
  let valid_res_uuid: UUIDV4;
  let conversation_id_string: string;
  let conversation_id: ObjectId;

  class CustomFatalError extends Error {}

  try {
    await fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body), // TODO - write type interface for fetchEventSource req.body
      async onopen(res) {
        //-- Get values from headers --//
        let new_message_version_timestamp: number = parseInt(
          res.headers.get("CHRT-new-message-version-timestamp") || "0"
        );
        let completion_pseudo_timestamp: number = parseInt(
          res.headers.get("CHRT-completion-pseudo-timestamp") || "0"
        );
        conversation_id_string =
          res.headers.get("CHRT-conversation-id-string") || "";
        res_uuid_to_validate =
          res.headers.get("CHRT-completion-message-uuid") || "";

        //-- Validate uuid and timestamp, else throw error to terminate request --//
        if (
          conversation_id_string === "" ||
          res_uuid_to_validate === "" ||
          new_message_version_timestamp === 0 ||
          completion_pseudo_timestamp === 0
        ) {
          throw new CustomFatalError(
            "Error in one of the headers: CHRT-new-message-version-timestamp, CHRT-completion-pseudo-timestamp, CHRT-conversation-id-string, CHRT-completion-message-uuid"
          );
        }
        if (ObjectId.isValid(conversation_id_string)) {
          conversation_id = new ObjectId(conversation_id_string);
        } else {
          throw new CustomFatalError("invalid conversation._id");
        }
        valid_res_uuid = isValidUUIDV4(res_uuid_to_validate);

        let initial_completion_message: IMessage = {
          message_uuid: valid_res_uuid,
          author: model.api_name,
          model: model,
          created_at: new Date(), //-- Overwritten upon receipt of api_response_metadata --//
          role: "assistant",
          message: "",
        };

        // If no conversation._id set, set it --//
        if (conversation._id.equals(new ObjectId("000000000000000000000000"))) {
          setConversation(
            produce((draft) => {
              draft._id = conversation_id;
            })
          );
        }

        //-- Add initial_completion_message (IMessage) to conversation --//
        // TODO - implement specific order + version
        setConversation(
          produce((draft) => {
            //-- Update `messages` --//
            draft.messages[initial_completion_message.message_uuid] =
              initial_completion_message;

            //-- Update `message_order` for new_message --//
            // draft.message_order[new_message_version_timestamp] = {
            //   new_message_version_timestamp = new_message.message_uuid
            // };

            //-- Update `message_order` for completion_message --//
            draft.message_order[completion_pseudo_timestamp] = {
              [completion_pseudo_timestamp]:
                initial_completion_message.message_uuid,
            };
          })
        );

        //-- TODO - implement onopen logic, error handling --//
        if (
          res.ok &&
          res.headers.get("content-type") === EventStreamContentType
        ) {
          console.log("Connection made:", res); // DEV
        } else if (
          res.status >= 400 &&
          res.status < 500 &&
          res.status !== 429
        ) {
          console.log("Client side error", res);
        }
        return Promise.resolve();
      },
      onmessage(event) {
        //-- Error --//
        if (event.id && event.id === "error") {
          console.log("error", event.data); // DEV

          // TODO - implement error handling
        }
        //-- After SSE message chunks, receive completion message object --//
        else if (event.id && event.id === "completion_message") {
          console.log("completion_message: ", JSON.parse(event.data)); // DEV

          //-- Add completion_message (IMessage) to conversation --//
          let completion_message: IMessage = JSON.parse(event.data);
          setConversation(
            produce((draft) => {
              draft.messages[completion_message.message_uuid] =
                completion_message;
            })
          );
        }
        //-- After SSE message chunks, receive api_response_metatdata object --//
        else if (event.id && event.id === "api_response_metadata") {
          console.log("api_response_metadata: ", JSON.parse(event.data)); // DEV

          //-- Add api_responses (IAPIResponse) conversation in state --//
          let api_response_metadata: IAPIResponse = JSON.parse(event.data);
          setConversation(
            produce((draft) => {
              draft.api_responses.push(api_response_metadata);
            })
            // TODO - update message_created_at
          );
        }
        //-- SSE message chunks --//
        else {
          const uriDecodedData = decodeURIComponent(event.data);

          //-- Update message content (IMessage.message) in conversation --//
          setConversation(
            produce((draft) => {
              draft.messages[valid_res_uuid].message =
                (draft.messages[valid_res_uuid].message || "") + uriDecodedData;
            })
          );
        }
      },
      onclose() {
        console.log("Connection closed by the server"); // DEV
      },
      onerror(err) {
        if (err instanceof CustomFatalError) {
          console.error(err.message);
          throw err; //-- Rethrow error to end request --//
        } else {
          console.log("There was an error from server", err);
        }
      },
    });
  } catch (err) {
    console.log(err);
  }
}
