//-- IChatsonObject - represents one entire chat --//
export interface IChatsonObject {
  metadata: {
    "single-or-multi-user": string;
    user_ids: string[];
    chat_uuid: string;
    creation_timestamp_immutable: string;
    reference_timestamp_mutable: string;
    user_tags: string[];
    chrt_tags: string[];
    opensearch_tags: string[];
  };
  linear_message_history: IChatsonMessage[];
  api_response_history: IChatsonAPIResponse[];
}

//-- IChatsonMessage - used for both prompts and responses --//
export interface IChatsonMessage {
  user: string;
  model: string;
  timestamp: string;
  message_uuid: string;
  role: ChatCompletionRequestMessageRoleEnum;
  message: string;
}

//-- List of LLM models --//
export type CurrentChatsonModelNames = "gpt-3.5-turbo" | "gpt-4" | "gpt-4-32k";

export interface IChatsonModel {
  apiName: CurrentChatsonModelNames;
  friendlyName: string;
  description: string;
}

//-- Information about API Responses --//
export interface IChatsonAPIResponse {
  user: string;
  model: string;
  id: string;
  object: string;
  created: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

//-- (2023-03-28) Types copy-pasted from OpenAI Node SDK --//

/**
 *
 * @export
 * @interface ChatCompletionRequestMessage
 */
export interface ChatCompletionRequestMessage {
  /**
   * The role of the author of this message.
   * @type {string}
   * @memberof ChatCompletionRequestMessage
   */
  role: ChatCompletionRequestMessageRoleEnum;
  /**
   * The contents of the message
   * @type {string}
   * @memberof ChatCompletionRequestMessage
   */
  content: string;
  /**
   * The name of the user in a multi-user chat
   * @type {string}
   * @memberof ChatCompletionRequestMessage
   */
  name?: string;
}
export declare const ChatCompletionRequestMessageRoleEnum: {
  readonly System: "system";
  readonly User: "user";
  readonly Assistant: "assistant";
};
export declare type ChatCompletionRequestMessageRoleEnum =
  (typeof ChatCompletionRequestMessageRoleEnum)[keyof typeof ChatCompletionRequestMessageRoleEnum];

/**
 *
 * @export
 * @interface ChatCompletionResponseMessage
 */
export interface ChatCompletionResponseMessage {
  /**
   * The role of the author of this message.
   * @type {string}
   * @memberof ChatCompletionResponseMessage
   */
  role: ChatCompletionResponseMessageRoleEnum;
  /**
   * The contents of the message
   * @type {string}
   * @memberof ChatCompletionResponseMessage
   */
  content: string;
}
export declare const ChatCompletionResponseMessageRoleEnum: {
  readonly System: "system";
  readonly User: "user";
  readonly Assistant: "assistant";
};
export declare type ChatCompletionResponseMessageRoleEnum =
  (typeof ChatCompletionResponseMessageRoleEnum)[keyof typeof ChatCompletionResponseMessageRoleEnum];
