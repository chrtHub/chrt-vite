import { Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";

import { IChatsonObject, IChatsonMessage } from "./types";

//-- Utility Function --//
const timestamp = (): string => {
  return getUnixTime(new Date()).toString();
};

/**
 * Causes an LLM API call after adding a propmt to a chatson object
 *
 * @param prompt user input to be added to the chat history and sent to the LLM
 * @param user_ids array of user ids. current user should be at index 0.
 * @param chatson_object if null, a new chat is created. otherwise, the prompt is appended to the chatson_object
 * @returns IChatsonObject updated with the new prompt
 */
export function add_prompt(
  prompt: string,
  user_ids: string[],
  chatson_object: IChatsonObject | null
) {
  //-- If no chat object, create a new chat object --//
  if (!chatson_object) {
    let newChatObject: IChatsonObject = version_A;

    newChatObject.metadata["single-or-multi-user"] = "single";
    newChatObject.metadata.user_ids = user_ids;
    newChatObject.metadata.chat_uuid = uuidv4();
    newChatObject.metadata.creation_timestamp_immutable = timestamp();
    newChatObject.metadata.reference_timestamp_mutable = timestamp();

    console.log(JSON.stringify(newChatObject, null, 2)); // DEV
  }

  // TODO
  let new_message: IChatsonMessage = {
    role: "user",
    author: user_ids[0],
    timestamp: timestamp(),
    message_uuid: uuidv4(),
    content: prompt,
  };
  // add prompt to chatson object
  // chatson_object.linear_message_history.push(new_message);
  // extract appropriate messages from chatson object to be sent to the LLM API
  // // e.g. system message, previous chat messages up to model's token limit
  // make an API call
  // when the response is fully received, it's added to the chatson object
}

//-- Chatson Templates --//
export const version_A: IChatsonObject = {
  chatson_version: "A",
  notes: {
    metadata: "Basic info and stats about this chat object",
    linear_message_history:
      "Mutable message history used as source of truth for (1) sending requests to the LLM, (2) rendering a chat on screen to a user. Note - the system message is immutable.",
    api_call_history:
      "An append-only log of API calls used to track token consumption and for general reference.",
  },
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
      author: "chrt",
      timestamp: "",
      message_uuid: "",
      content:
        "Your name is ChrtGPT. Refer to yourself as ChrtGPT. You are ChrtGPT, a helpful assistant that helps power a day trading performance journal. You sometimes make jokes and say silly things on purpose.",
    },
  ],
  api_call_history: [],
};
