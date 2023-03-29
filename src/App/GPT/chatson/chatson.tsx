import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";

import { IChatsonObject, IChatsonMessage, IChatsonModel } from "./types";
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
export function send_message(
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

  //-- Estimate token count per message --//
  // let tokens: number = 0;
  // tokens += tiktoken(chatson_object.linear_message_history[0].message);
  // tokens += tiktoken(chatson_message.message);

  // Make API call from here and add reponse to state

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
