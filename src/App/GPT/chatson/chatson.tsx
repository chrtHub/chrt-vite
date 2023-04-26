import { produce } from "immer";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

import { getUserDbId } from "../../../Util/getUserDbId";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import {
  IAPIReqResMetadata,
  IConversation,
  IMessage,
  IModel,
  IChatCompletionRequestBody,
} from "./chatson_types";
import { ObjectId } from "bson";

/**
 * Causes an LLM API call after adding a propmt to a chatson object
 *
 * @param access_token (a) set as the author id, (b) sent as Bearer token in 'authorization' header
 * @param prompt_content user input to be added to the conversation
 * @param parentNodeUUID parent node's uuid from the message_tree
 * @param model LLM model to be used
 * @param conversation When null, the server creates a new conversation. Otherwise, the prompt is added to the conversation.
 * @param setConversation state setter for the conversation
 * @returns IChatsonObject updated with the new prompt
 */
export async function send_message(
  access_token: string,
  prompt_content: string,
  parent_node_id: ObjectId,
  model: IModel,
  conversation: IConversation | null,
  setConversation: React.Dispatch<React.SetStateAction<IConversation>>
) {
  console.log(" ----- SEND MESSAGE ----- "); // DEV

  //-- Get user_db_id from access token --//
  let user_db_id = getUserDbId(access_token);

  //-- Build prompt --//
  let prompt: IMessage = {
    author: user_db_id,
    model: model,
    created_at: new Date(),
    role: "user",
    content: prompt_content,
  };

  //-- Build request_body --//
  let request_body: IChatCompletionRequestBody = {
    prompt: prompt,
    conversation_id: conversation?._id || null,
    parent_node_id: parent_node_id || null,
  };

  //-- Headers --//
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  class CustomFatalError extends Error {} // TODO - build as needed
  try {
    await fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(request_body),
      async onopen(res) {
        //
      },
      onmessage(event) {
        //
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
