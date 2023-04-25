import { produce } from "immer";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

import { getUserDbId } from "../../../Util/getUserDbId";
import { validUUIDV4orDummy, getUUIDV4 } from "../../../Util/getUUIDV4";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import {
  IAPIReqResMetadata,
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
 * @param parentNodeUUID parent node's uuid from the message_tree
 * @param model LLM model to be used
 * @param conversation When null, the server creates a new conversation. Otherwise, the message is added to the conversation.
 * @param setConversation state setter for the conversation
 * @returns IChatsonObject updated with the new prompt
 */
export async function send_message(
  access_token: string,
  message: string,
  parentNodeUUID: UUIDV4,
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
      // TODO
      // add new_message to message_tree
      // produce((draft) => {
      //   draft.message_tree
      // })
    })
  );

  //-- Fetch Event Source for Chat Completions Request --//
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  const body: IChatCompletionRequestBody = {
    _id_string: conversation._id.toString(),
    new_message: new_message,
    parentNodeUUID: parentNodeUUID, // TODO - implement a way to set version_of for new_message
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
        //-- If no conversation._id set, set it --//
        const conversation_id_string =
          res.headers.get("CHRT-conversation-id-string") || "";
        const conversation_id = ObjectId.createFromHexString(
          conversation_id_string
        );

        if (conversation._id.equals(new ObjectId("000000000000000000000000"))) {
          setConversation(
            produce((draft) => {
              draft._id = conversation_id;
            })
          );
        }

        //-- Add initial_completion_message to `messages` and `message_order` --//
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

        // TODO - implement specific order + version
        setConversation(
          produce((draft) => {
            //-- Update `messages` --//
            draft.messages[initial_completion_message.message_uuid] =
              initial_completion_message;

            // TODO
            // update message_tree - add completion_message_uuid
            // produce((draft) => {
            //   draft.message_tree
            // })
          })
        );

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
        //-- After SSE message chunks, add completion_message to conversation --//
        else if (event.id && event.id === "completion_message") {
          let completion_message: IMessage = JSON.parse(event.data);
          setConversation(
            produce((draft) => {
              draft.messages[completion_message.message_uuid] =
                completion_message;
            })
          );
        }
        //-- After SSE message chunks add api_response conversation --//
        else if (event.id && event.id === "api_req_res_metadata") {
          let api_req_res_metadata: IAPIReqResMetadata = JSON.parse(event.data);
          setConversation(
            produce((draft) => {
              draft.api_req_res_metadata.push(api_req_res_metadata);
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
