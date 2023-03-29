import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";
import axios from "axios";

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
 * @param message user input to be added to the chat history and sent to the LLM
 * @param user_ids array of user ids. current user should be at index 0.
 * @param chatson_object if null, a new chat is created. otherwise, the prompt is appended to the chatson_object
 * @returns IChatsonObject updated with the new prompt
 */
export async function send_message(
  accessToken: string,
  chatson_object: IChatsonObject | null,
  user_ids: string[],
  model: IChatsonModel,
  message: string,
  setChatson: React.Dispatch<React.SetStateAction<IChatsonObject | null>>,
  setLLMLoading: React.Dispatch<React.SetStateAction<boolean>>
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

    //-- Set system message data --//
    chatson_object.linear_message_history[0].model = model.apiName;
    chatson_object.linear_message_history[0].timestamp = timestamp();
    chatson_object.linear_message_history[0].message_uuid = uuidv4();
  }

  //-- Crete new chatson_message --//
  let chatson_message: IChatsonMessage = {
    role: "user",
    user: user_ids[0],
    model: model.apiName,
    timestamp: timestamp(),
    message_uuid: uuidv4(),
    message: message,
  };

  //-- Append chatson_message to chatson_object and update state --//
  chatson_object.linear_message_history.push(chatson_message);
  setChatson(chatson_object);

  //-- Start with "system" message and add up to 3,000 tokens worth of messages --//
  let system_message = chatson_object.linear_message_history[0];
  let tokens = tiktoken(system_message.message);

  let chatRequestMessages: Array<ChatCompletionRequestMessage> = [
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
    let contentTokens = tiktoken(content);

    if (tokens + contentTokens < 3000) {
      tokens += contentTokens;
      console.log("tokens: " + tokens); // DEV
      let chatRequestMessage: ChatCompletionRequestMessage = {
        role: chatson_object.linear_message_history[idx].role,
        content: content,
      };

      //-- Insert after system message, shifting any other messages --//
      chatRequestMessages.splice(1, 0, chatRequestMessage);
    } else {
      tokenLimitHit = true;
      console.log("token limit hit!"); // DEV
    }

    idx--;
  }

  console.log(chatRequestMessages); // DEV

  //-- Make API call - send chatRequestMessages --//
  setLLMLoading(true);
  try {
    //-- Make POST request --//
    let res = await axios.post(
      `${VITE_ALB_BASE_URL}/llm/gpt-3.5-turbo`,
      //-- Body Content --//
      {
        model: model.apiName,
        chatRequestMessages: chatRequestMessages,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    let chatCompletionsResponse: CreateChatCompletionResponse = res.data;

    if (chatCompletionsResponse.choices[0].message) {
      console.log(chatCompletionsResponse.choices[0].message.content); // DEV

      //-- Add response to chatson_object --//
      let chat_response: IChatsonMessage = {
        user: model.apiName,
        model: model.apiName,
        timestamp: timestamp(),
        message_uuid: uuidv4(),
        role: "assistant",
        message: res.data.choices[0].message.content,
      };
      chatson_object.linear_message_history.push(chat_response);

      //-- Add API Call to chatson_object --//
      let api_call_data: IChatsonAPIResponse = {
        user: user_ids[0],
        model: model.apiName,
        response_id: chatCompletionsResponse.id,
        object: chatCompletionsResponse.object,
        created: chatCompletionsResponse.created,
        prompt_tokens: chatCompletionsResponse.usage?.prompt_tokens || 0,
        completion_tokens:
          chatCompletionsResponse.usage?.completion_tokens || 0,
        total_tokens: chatCompletionsResponse.usage?.total_tokens || 0,
      };
      chatson_object.api_response_history.push(api_call_data);
    }

    setChatson(chatson_object);
    //----//
  } catch (err) {
    console.log(err);
  }
  setLLMLoading(false);
}

//-- Chatson Templates --//
export const version_A: IChatsonObject = {
  metadata: {
    "single-or-multi-user": "",
    user_ids: [],
    chat_uuid: "",
    creation_timestamp_immutable: "",
    reference_timestamp_mutable: "",
    user_tags: [],
    chrt_tags: [],
    opensearch_tags: [],
  },
  linear_message_history: [
    {
      user: "chrt",
      model: "",
      timestamp: "",
      message_uuid: "",
      role: "system",
      message:
        "Your name is ChrtGPT. Refer to yourself as ChrtGPT. You are ChrtGPT, a helpful assistant that helps power a day trading performance journal. You sometimes make jokes and say silly things on purpose.",
    },
  ],
  api_response_history: [],
};
