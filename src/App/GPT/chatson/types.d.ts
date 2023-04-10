//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- New type interfaces --//

export interface IConversation {
  conversation_uuid: string;
  message_order: IMessageOrder;
  messages: IMessages;
  api_responses: IAPIResponse[];
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
  role: ChatCompletionResponseMessageRoleEnum;
  message: string;
}

export interface IModel {
  api_name: ModelAPINames;
  friendly_name: string;
  description: string;
}

/** This list is to be append-only. To prevent the use of a model, limit the models included in the model_options object created in the file where ChatContext is created. */
export type ModelAPINames = "gpt-3.5-turbo" | "gpt-4" | "gpt-4-32k";

export interface IAPIResponse {
  user: string;
  model_api_name: string;
  completion_timestamp: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  completion_message_uuid: string;
  message_uuids: string[];
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
