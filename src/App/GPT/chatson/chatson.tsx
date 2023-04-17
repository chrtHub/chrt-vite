import { getUnixTime } from "date-fns";
import axios from "axios";
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
  model: IModel,
  message: string,
  conversation: IConversation,
  setConversation: React.Dispatch<React.SetStateAction<IConversation>>
) {
  console.log("SEND MESSAGE"); // DEV
  console.log("conversation: ", conversation); // DEV

  //-- Get user_db_id from access token --//
  let user_db_id = getUserDbId(access_token);

  //-- Create token signal and counter --//
  let tokenLimitHit = false;
  let token_sum = 0;

  //-- Get system message from conversation --//
  let system_message_uuid = conversation.message_order[1][1];
  let system_message = conversation.messages[system_message_uuid];

  //-- Crete new message object --//
  let new_message: IMessage = {
    message_uuid: getUUIDV4(),
    author: user_db_id,
    model: model,
    timestamp: timestamp(),
    role: "user",
    message: message,
  };

  //-- Add system_message and new_message to request_messages. Count tokens --//
  let request_messages: ChatCompletionRequestMessage[] = [
    {
      role: system_message.role,
      content: system_message.message,
    },
    {
      role: "user",
      content: new_message.message,
    },
  ];
  token_sum += tiktoken(system_message.message);
  token_sum += tiktoken(new_message.message);

  //-- Add messages to request_messages by descending 'order' --//
  const message_order_keys = Object.keys(conversation.message_order).map(
    Number
  );
  const message_order_keys_descending = reverse(sortBy(message_order_keys));
  let maxOrder = message_order_keys_descending[0];
  let order_counter = message_order_keys_descending[0];

  //-- Add messages until token limit hit or all non-system messages added --//
  while (!tokenLimitHit && order_counter > 1) {
    console.log("TODO - add message");
    //-- Get the versions object by order_counter number --//
    let versions_object = conversation.message_order[order_counter];

    //-- If multiple versions, use the latest --//
    // TODO - implement versions
    let message_uuid = versions_object[1];

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

    order_counter--;
  }
  console.log("request_messages: ", request_messages); // DEV

  //-- Add new_message object to conversation --//
  setConversation((prevConversation) => {
    return {
      ...prevConversation,
      messages: {
        ...prevConversation.messages,
        [new_message.message_uuid]: new_message,
      },
      message_order: {
        ...prevConversation.message_order,
        [maxOrder + 1]: {
          1: new_message.message_uuid,
        },
      },
    };
  });

  //-- Fetch Event Source for Chat Completions Request --//
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  const body: IChatCompletionRequestBody = {
    conversation_uuid: conversation.conversation_uuid,
    request_messages: request_messages, // TO BE DEPRACATED
    new_message: new_message,
    new_message_order: null, // TO ADD - if order specified, message will become the next version (possibly 1) for that order
    model: model,
  };

  let res_uuid_to_validate: string;
  let valid_res_uuid: UUIDV4;
  let res_timestamp: string;

  class CustomFatalError extends Error {}

  try {
    await fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body), // TODO - write type interface for fetchEventSource req.body
      async onopen(res) {
        res_uuid_to_validate =
          res.headers.get("CHRT-completion-message-uuid") || "";
        res_timestamp = res.headers.get("CHRT-timestamp") || "";

        //-- Validate uuid and timestamp, else throw error to terminate request --//
        if (res_uuid_to_validate === "" || res_timestamp === "") {
          throw new CustomFatalError(
            "CHRT-completion-message-uuid or CHRT-timestamp header null"
          );
        }
        valid_res_uuid = isValidUUIDV4(res_uuid_to_validate);

        let initial_completion_message: IMessage = {
          message_uuid: valid_res_uuid,
          author: model.api_name,
          model: model,
          timestamp: res_timestamp,
          role: "assistant",
          message: "",
        };

        //-- Add initial_completion_message (IMessage) to conversation --//
        setConversation((prevConversation) => {
          return {
            ...prevConversation,
            messages: {
              ...prevConversation.messages,
              [initial_completion_message.message_uuid]:
                initial_completion_message,
            },
            message_order: {
              ...prevConversation.message_order,
              [maxOrder + 2]: {
                1: initial_completion_message.message_uuid,
              },
            },
          };
        });

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
          setConversation((prevConversation) => {
            return {
              ...prevConversation,
              messages: {
                ...prevConversation.messages,
                [completion_message.message_uuid]: completion_message,
              },
            };
          });
        }
        //-- After SSE message chunks, receive api_response_metatdata object --//
        else if (event.id && event.id === "api_response_metadata") {
          console.log("api_response_metadata: ", JSON.parse(event.data)); // DEV

          //-- Add api_responses (IAPIResponse) conversation in state --//
          let api_response_metadata: IAPIResponse = JSON.parse(event.data);
          setConversation((prevConversation) => {
            return {
              ...prevConversation,
              api_responses: [
                ...prevConversation.api_responses,
                api_response_metadata,
              ],
            };
          });
        }
        //-- SSE message chunks --//
        else {
          const uriDecodedData = decodeURIComponent(event.data);

          //-- Update message content (IMessage.message) in conversation --//
          setConversation((prevConversation) => {
            const prevCompletionMessage =
              prevConversation.messages[valid_res_uuid];
            const prevCompletionMessageContent =
              prevConversation.messages[valid_res_uuid].message;

            return {
              ...prevConversation,
              messages: {
                ...prevConversation.messages,
                [valid_res_uuid]: {
                  ...prevCompletionMessage,
                  message:
                    (prevCompletionMessageContent || "") + uriDecodedData,
                },
              },
            };
          });
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
