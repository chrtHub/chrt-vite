import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";
import axios from "axios";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import {
  IChatsonObject,
  IChatsonMessage,
  IChatsonModel,
  IChatsonAPIResponse,
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
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
 * @param chatson_object if null, a new chat is created. otherwise, the prompt is appended to the chatson_object
 * @param user_ids array of user ids. current user should be at index 0.
 * @param model model to use for API call
 * @param prompt user input to be added to the chat history and sent to the LLM
 * @param setChatson state setter for the chatson_object
 * @returns IChatsonObject updated with the new prompt
 */
export async function send_message(
  access_token: string,
  chatson_object: IChatsonObject | null,
  user_ids: string[],
  model: IChatsonModel,
  message: string,
  setChatson: React.Dispatch<React.SetStateAction<IChatsonObject | null>>
) {
  //-- If chat object is null, create a new chat object --//
  if (!chatson_object) {
    //-- Instantiate new object from template --//
    chatson_object = version_A;

    //-- Set metadata --//
    chatson_object.metadata["single-or-multi-user"] = "single";
    chatson_object.metadata.user_ids = user_ids;
    chatson_object.metadata.chat_uuid = uuidv4();
    chatson_object.metadata.creation_timestamp_immutable = timestamp();
    chatson_object.metadata.reference_timestamp_mutable = timestamp();
    chatson_object.metadata.most_recent_message_timestamp = timestamp(); // TODO - update this upon receipt of response from LLM

    //-- Set system prompt data --//
    chatson_object.linear_message_history[0].model = model;
    chatson_object.linear_message_history[0].timestamp = timestamp();
    chatson_object.linear_message_history[0].message_uuid = uuidv4();
  }

  //-- Crete new chatson_message --//
  let chatson_message: IChatsonMessage = {
    role: "user",
    author: user_ids[0],
    model: model,
    timestamp: timestamp(),
    message_uuid: uuidv4(),
    message: message,
  };

  //-- Append chatson_message to chatson_object and update state --//
  chatson_object.linear_message_history.push(chatson_message);
  setChatson(chatson_object);

  //-- Start with "system" message and add up to 3,000 tokens worth of messages --//
  let system_message = chatson_object.linear_message_history[0];
  let token_sum = 0;
  token_sum += tiktoken(system_message.message);

  let chat_request_messages: Array<ChatCompletionRequestMessage> = [
    {
      role: system_message.role,
      content: system_message.message,
    },
  ];

  let tokenLimitHit = false;
  let idx = chatson_object.linear_message_history.length - 1;

  //-- Add messages until token limit hit or all non-system messages added --//
  while (!tokenLimitHit && idx > 0) {
    let content = chatson_object.linear_message_history[idx].message;
    let content_tokens = tiktoken(content);

    if (token_sum + content_tokens < 3000) {
      token_sum += content_tokens;
      let chat_request_message: ChatCompletionRequestMessage = {
        role: chatson_object.linear_message_history[idx].role,
        content: content,
      };

      //-- Insert after system message, shifting any other messages --//
      chat_request_messages.splice(1, 0, chat_request_message);
    } else {
      tokenLimitHit = true;
      console.log("token limit hit!"); // DEV
    }

    idx--;
  }

  console.log("token_sum: " + token_sum); // DEV
  console.log(chat_request_messages); // DEV

  //-- Axios POST for Chat Completions Request (non-SSE) --//
  // try {
  //   let res = await axios.post(
  //     `${VITE_ALB_BASE_URL}/openai/v1/chat/completions`,
  //     {
  //       model: model.apiName,
  //       chat_request_messages: chat_request_messages,
  //     },
  //     {
  //       headers: {
  //         authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   console.log(res);

  //   let chatCompletionsResponse: CreateChatCompletionResponse = res.data;

  //   if (chatCompletionsResponse.choices[0].message) {
  //     console.log(chatCompletionsResponse.choices[0].message.content); // DEV

  //     //-- Add response to chatson_object --//
  //     let chat_response: IChatsonMessage = {
  //       author: model.apiName,
  //       model: model,
  //       timestamp: timestamp(),
  //       message_uuid: uuidv4(),
  //       role: "assistant",
  //       message: res.data.choices[0].message.content,
  //     };
  //     chatson_object.linear_message_history.push(chat_response);

  //     //-- Add API Call to chatson_object --//
  //     let api_call_data: IChatsonAPIResponse = {
  //       user: user_ids[0],
  //       model: model.apiName,
  //       response_id: chatCompletionsResponse.id,
  //       object: chatCompletionsResponse.object,
  //       created: chatCompletionsResponse.created,
  //       prompt_tokens: chatCompletionsResponse.usage?.prompt_tokens || 0,
  //       completion_tokens:
  //         chatCompletionsResponse.usage?.completion_tokens || 0,
  //       total_tokens: chatCompletionsResponse.usage?.total_tokens || 0,
  //     };
  //     chatson_object.api_response_history.push(api_call_data);
  //   }

  //   setChatson(chatson_object);
  // } catch (error) {
  //   console.log(error);
  // }

  //-- Fetch Event Source for Chat Completions Request --//
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    model: model.apiName,
    chat_request_messages: chat_request_messages,
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

//-- Chatson Templates --//
export const version_A: IChatsonObject = {
  metadata: {
    "single-or-multi-user": "",
    user_ids: [],
    chat_uuid: "",
    creation_timestamp_immutable: "",
    reference_timestamp_mutable: "",
    most_recent_message_timestamp: "",
    user_tags: [],
    chrt_tags: [],
    opensearch_tags: [],
  },
  linear_message_history: [
    {
      author: "chrt",
      model: {
        apiName: "gpt-3.5-turbo", // TODO - make this optional
        friendlyName: "",
        description: "",
      },
      timestamp: "",
      message_uuid: "",
      role: "system",
      message:
        "Your name is ChrtGPT. Refer to yourself as ChrtGPT. You are ChrtGPT, a helpful assistant that helps power a day trading performance journal. You sometimes make jokes and say silly things on purpose.",
    },
  ],
  api_response_history: [],
};

//----//
// setState() - overwrite message with matching uuid as SSE received(?)

// In EFS, store as filename of '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.json'
const conversation = {
  conversation_uuid: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  message_order: {
    1: {
      1: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    },
    3: {
      1: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    },
    2: {
      1: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
      2: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    },
  },
  messages: {
    "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed": {
      message_uuid: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
      author: "chrt",
      model: {
        apiName: "gpt-3.5-turbo",
        friendlyName: "",
        description: "",
      },
      timestamp: "",
      role: "system",
      message:
        "Your name is ChrtGPT. Refer to yourself as ChrtGPT. You are ChrtGPT, a helpful assistant that helps power a day trading performance journal. You sometimes make jokes and say silly things on purpose.",
    },
  },
  // Array of apiResponseMetatdata objects
  apiResponses: [
    {
      user: "",
      model: "",
      completed_timestamp: "",
      prompt_tokens: 20,
      completion_tokens: 20,
      total_tokens: 40,
      message_uuids: [],
    },
  ],
};
