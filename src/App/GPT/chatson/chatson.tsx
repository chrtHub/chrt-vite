import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";

import { IChatsonObject, IChatsonMessage, IChatsonModel } from "./types";

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
export function send_message(
  chatson_object: IChatsonObject | null,
  user_ids: string[],
  model: IChatsonModel,
  message: string
) {
  //-- If chat object is null, create a new chat object --//
  if (!chatson_object) {
    chatson_object = version_A;

    chatson_object.metadata["single-or-multi-user"] = "single";
    chatson_object.metadata.user_ids = user_ids;
    chatson_object.metadata.chat_uuid = uuidv4();
    chatson_object.metadata.creation_timestamp_immutable = timestamp();
    chatson_object.metadata.reference_timestamp_mutable = timestamp();

    console.log(JSON.stringify(chatson_object, null, 2)); // DEV
  }

  //-- Crete chatson_message --//
  let chatson_message: IChatsonMessage = {
    role: "user",
    user: user_ids[0],
    model: model.apiName,
    timestamp: timestamp(),
    message_uuid: uuidv4(),
    message: message,
  };

  //-- Add chatson_message to chatson_object --//
  chatson_object.linear_message_history.push(chatson_message);
  // set state using the ChatContext setters? to the new chatson_object value

  //-- Count tokens and send up to 3,000 tokens of messages to the API --//
  // first, unshift the "system" message and count its tokens
  // // add the system message to the API call messages
  // start a running total of tokens at the "system" messge token count
  // pop messages from the linear message history
  // count the tokens of the message
  // if the sum of the running total and the message tokens <= 3000, add the message to the API call messages
  // // if >3000, don't add the message. Send the API request
  // // if pop returns nothing, send the API request

  // when the response is received, use it to create:
  // // message for linear_message_history
  // // ChatsonAPIResposne for api_response_history
  // push those objects into the arrays
  // call setState from ChatContext to update the chatson_object
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
      role: "system",
      user: "chrt",
      model: "",
      timestamp: "",
      message_uuid: "",
      message:
        "Your name is ChrtGPT. Refer to yourself as ChrtGPT. You are ChrtGPT, a helpful assistant that helps power a day trading performance journal. You sometimes make jokes and say silly things on purpose.",
    },
  ],
  api_response_history: [],
};
