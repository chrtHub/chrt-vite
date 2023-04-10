import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";
import axios from "axios";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
  IConversation,
  IMessage,
  IModel,
} from "./types";
import { tiktoken } from "./tiktoken";

//-- Utility Function --//
const timestamp = (): string => {
  return getUnixTime(new Date()).toString();
};

/**
 * Causes an LLM API call after adding a propmt to a chatson object
 *
 * @param access_token user credential to be sent as Bearer token in 'authorization' header
 * @param conversation if null, a new chat is created. otherwise, the prompt is appended to the conversation
 * @param user_ids array of user ids. current user should be at index 0.
 * @param model model to use for API call
 * @param prompt user input to be added to the chat history and sent to the LLM
 * @param setChatson state setter for the conversation
 * @returns IChatsonObject updated with the new prompt
 */
export async function send_message(
  access_token: string,
  user_ids: string[],
  model: IModel,
  message: string,
  conversation: IConversation,
  setConversation: React.Dispatch<React.SetStateAction<IConversation>>
) {
  //-- Crete new message object --//
  let newMessage: IMessage = {
    message_uuid: uuidv4(),
    author: user_ids[0],
    model: model,
    timestamp: timestamp(),
    role: "user",
    message: message,
  };

  //-- Add newMessage object to messages in conversation in state --//
  const updatedMessages = { ...conversation.messages };
  updatedMessages[newMessage.message_uuid] = newMessage;
  setConversation({ ...conversation, messages: updatedMessages });

  //-- Create request_messages array and add system_message --//
  let system_message_uuid = conversation.message_order[1][1];
  let system_message = conversation.messages[system_message_uuid];
  let request_messages: Array<ChatCompletionRequestMessage> = [
    {
      role: system_message.role,
      content: system_message.message,
    },
  ];

  //-- Count tokens and add messages to request_messages array --//
  let token_sum = 0;
  let tokenLimitHit = false;
  token_sum += tiktoken(system_message.message);

  //-- Add to request_messages starting from highest message 'order' --//
  const message_order_keys = Object.keys(conversation.message_order).map(
    Number
  );
  const message_order_keys_descending = reverse(sortBy(message_order_keys));
  let order = message_order_keys_descending[0];

  //-- Add messages until token limit hit or all non-system messages added --//
  while (!tokenLimitHit && order > 1) {
    //-- Get the versions object by order number --//
    let versions_object = conversation.message_order[order];

    //-- If multiple versions, use the latest --//
    let message_uuid;
    if (Object.keys(versions_object).length > 1) {
      const version_order_keys_descending = reverse(
        sortBy(Object.keys(versions_object))
      );
      message_uuid = version_order_keys_descending[0];
    } //-- Else use version '1' --//
    else {
      message_uuid = versions_object[1];
    }

    //-- Get the message_content --//
    let message_object = conversation.messages[message_uuid];
    let message_tokens = tiktoken(message_object.message);

    if (token_sum + message_tokens < 3000) {
      token_sum += message_tokens;
      //-- Add message to request_messages --//
      let chat_request_message: ChatCompletionRequestMessage = {
        role: message_object.role,
        content: message_object.message,
      };

      //-- Insert after system message, shifting any other messages --//
      request_messages.splice(1, 0, chat_request_message);
    } else {
      tokenLimitHit = true;
      console.log("token limit hit!"); // DEV
    }

    order--;
  }

  //-- Fetch Event Source for Chat Completions Request --//
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    model: model.api_name,
    request_messages: request_messages,
  });

  //-- Define errors --//
  try {
    await fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
      method: "POST",
      headers: headers,
      body: body,
      onopen(res) {
        if (
          res.ok &&
          res.headers.get("content-type") === EventStreamContentType
        ) {
          console.log("Connection made ", res);
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
        if (event.id && event.id === "apiResponseMetadata") {
          // TODO - add response metadata to chatson object
          console.log("apiResponseMetadata: ", JSON.parse(event.data));
        } else {
          // TODO - add response message to chatson object
          console.log(event.data); // DEV
          // setChatson() // overwrite just the particular message...
        }
      },
      onclose() {
        // console.log("Connection closed by the server"); // DEV
      },
      onerror(err) {
        console.log("There was an error from server", err);
      },
    });
  } catch (err) {
    console.log(err);
  }
}
