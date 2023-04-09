//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- New type interfaces --//

export interface IConversation {
  conversation_uuid: string;
  message_order: IMessageOrder;
  messages: IMessages;
  apiResponses: IAPIResponse[];
}

export interface IMessageOrder {
  [order: number]: {
    [version: number]: string;
  };
}

export interface IMessages {
  [uuid: string]: IMessage;
}

export interface IMessage {
  message_uuid: string;
  author: string;
  model: IModel;
  timestamp: string;
  role: string;
  message: string;
}

export interface IModel {
  apiName: ModelAPINames;
  friendlyName: string;
  description: string;
}

export type ModelAPINames = "gpt-3.5-turbo" | "gpt-4" | "gpt-4-32k";

export interface IAPIResponse {
  user: string;
  model: string;
  completed_timestamp: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  message_uuids: string[];
}

//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- Old type interfaces --//

//-- IChatsonObject - represents one entire chat --//
export interface IChatsonObject {
  metadata: {
    "single-or-multi-user": string;
    user_ids: string[];
    chat_uuid: string;
    creation_timestamp_immutable: string;
    reference_timestamp_mutable: string;
    most_recent_message_timestamp: string;
    user_tags: string[];
    chrt_tags: string[];
    opensearch_tags: string[];
  };
  linear_message_history: IChatsonMessage[];
  api_response_history: IChatsonAPIResponse[];
}

//-- IChatsonMessage - used for both prompts and responses --//
export interface IChatsonMessage {
  author: string;
  model: IChatsonModel;
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
  response_id: string;
  created: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
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

/**
 *
 * @export
 * @interface CreateChatCompletionResponse
 */

export interface CreateChatCompletionResponse {
  /**
   *
   * @type {string}
   * @memberof CreateChatCompletionResponse
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof CreateChatCompletionResponse
   */
  object: string;
  /**
   *
   * @type {number}
   * @memberof CreateChatCompletionResponse
   */
  created: number;
  /**
   *
   * @type {string}
   * @memberof CreateChatCompletionResponse
   */
  model: string;
  /**
   *
   * @type {Array<CreateChatCompletionResponseChoicesInner>}
   * @memberof CreateChatCompletionResponse
   */
  choices: Array<CreateChatCompletionResponseChoicesInner>;
  /**
   *
   * @type {CreateCompletionResponseUsage}
   * @memberof CreateChatCompletionResponse
   */
  usage?: CreateCompletionResponseUsage;
}

/**
 *
 * @export
 * @interface CreateChatCompletionResponseChoicesInner
 */
export interface CreateChatCompletionResponseChoicesInner {
  /**
   *
   * @type {number}
   * @memberof CreateChatCompletionResponseChoicesInner
   */
  index?: number;
  /**
   *
   * @type {ChatCompletionResponseMessage}
   * @memberof CreateChatCompletionResponseChoicesInner
   */
  message?: ChatCompletionResponseMessage;
  /**
   *
   * @type {string}
   * @memberof CreateChatCompletionResponseChoicesInner
   */
  finish_reason?: string;
}

/**
 *
 * @export
 * @interface CreateCompletionResponseUsage
 */
export interface CreateCompletionResponseUsage {
  /**
   *
   * @type {number}
   * @memberof CreateCompletionResponseUsage
   */
  prompt_tokens: number;
  /**
   *
   * @type {number}
   * @memberof CreateCompletionResponseUsage
   */
  completion_tokens: number;
  /**
   *
   * @type {number}
   * @memberof CreateCompletionResponseUsage
   */
  total_tokens: number;
}
