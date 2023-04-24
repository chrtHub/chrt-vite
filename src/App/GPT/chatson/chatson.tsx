import { getUnixTime } from "date-fns";
import axios from "axios";
import { produce } from "immer";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

import { getUserDbId } from "../../../Util/getUserDbId";
import { validUUIDV4orDummy, getUUIDV4 } from "../../../Util/getUUIDV4";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import {
  IAPIResponse,
  IConversation,
  IMessage,
  IModel,
  IChatCompletionRequestBody,
  UUIDV4,
} from "./chatson_types";
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
      //-- Update message --//
      draft.messages[new_message.message_uuid] = new_message;

      //- temporary message_order timestamps, overwritten by values in response headers --//
      draft.message_order[Date.now()] = {
        [Date.now()]: new_message.message_uuid,
      };
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
    version_of: version_of, // TODO - implement a way to set version_of for new_message
    model: model,
  };

  let completion_message_uuid: UUIDV4;

  class CustomFatalError extends Error {}

  try {
    await fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body), // TODO - write type interface for fetchEventSource req.body
      async onopen(res) {
        //- Overwrite temporary message_order timestamps --//
        let new_message_order_timestamp: number = parseInt(
          res.headers.get("CHRT-new-message-order-timestamp") || "0"
        );
        let new_message_version_timestamp: number = parseInt(
          res.headers.get("CHRT-new-message-version-timestamp") || "0"
        );

        setConversation(
          produce((draft) => {
            draft.message_order[new_message_order_timestamp] = {
              [new_message_version_timestamp]: new_message.message_uuid,
            };
          })
        );

        //-- Add initial_completion_message to conversation --//
        let completion_message_uuid_string =
          res.headers.get("CHRT-completion-message-uuid") || "";
        completion_message_uuid = validUUIDV4orDummy(
          completion_message_uuid_string
        );

        const initial_completion_message: IMessage = {
          message_uuid: completion_message_uuid,
          author: model.api_name,
          model: model,
          created_at: new Date(), //-- Overwritten upon receipt of api_response_metadata --//
          role: "assistant",
          message: "",
        };

        const completion_pseudo_timestamp: number = parseInt(
          res.headers.get("CHRT-completion-pseudo-timestamp") || "0"
        );
        const conversation_id_string =
          res.headers.get("CHRT-conversation-id-string") || "";
        const conversation_id = new ObjectId(conversation_id_string);

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

        // If no conversation._id set, set it --//
        if (conversation._id.equals(new ObjectId("000000000000000000000000"))) {
          setConversation(
            produce((draft) => {
              draft._id = conversation_id;
            })
          );
        }

        // TODO - what to do for error handling here?
        //-- onopen logic, error handling --//
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
              draft.messages[completion_message_uuid].message =
                (draft.messages[completion_message_uuid].message || "") +
                uriDecodedData;
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
