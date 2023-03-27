import { Dispatch, SetStateAction } from "react";
import A from "./A.json";

/**
 * Creates a new chat object
 *
 * @param chatson_format indicate chatson format version
 * @returns chatson object intialized with basic information
 */
export enum Chatson_Format {
  "2023-03-26-A" = "2023-03-26-A",
}
export function create_chat(chatson_format: Chatson_Format): Object {
  // get a fresh version of the specified format of chatson object
  // fill in the basic information

  return A;
}

/**
 * Causes an LLM API call after adding a propmt to a chatson object
 *
 * @param prompt user input to be added to the chat history and sent to the LLM
 * @param chatson_object_state chatson chat object stored as a React state value
 * @param state_setter useState setter function used for updating the chatson object
 * @returns void
 */
export function send_prompt(
  prompt: string,
  chatson_object_state: string,
  state_setter: Dispatch<SetStateAction<String>>
) {
  // TODO
  // add prompt to chatson object
  // extract appropriate messages from chatson object to be sent to the LLM API
  // // e.g. system message, previous chat messages up to model's token limit
  // make an API call
  // when the response is fully received, it's added to the chatson object
}
