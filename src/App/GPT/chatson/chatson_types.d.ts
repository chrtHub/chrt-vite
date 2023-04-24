import { ObjectId } from "bson";

//-- Chatson Type Interfaces --//
export interface IConversation {
  _id: ObjectId;
  user_db_id: string;
  schema_version: string;
  created_at: Date;
  message_order: IMessageOrder;
  messages: IMessages;
  api_responses: IAPIResponse[];
  chatson_tags: string[]; //-- predefined lists for favorites, etc. --//
  user_tags: string[]; //-- user-defined tags --//
}

type UUIDV4 = string & {
  //-- UUIDv4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx --//
  //-- where x is any hexadecimal digit and y is one of 8, 9, A, or B --//
  readonly _uuidBrand: unique symbol;
};

export interface IMessageOrder {
  [order_timestamp_unix_ms: number]: {
    [version_timestamp_unix_ms: number]: UUIDV4;
  };
}

export interface IMessages {
  [uuid: UUIDV4]: IMessage;
}

export interface IMessage {
  message_uuid: UUIDV4;
  author: string;
  model: IModel;
  created_at: Date;
  role: ChatCompletionResponseMessageRoleEnum;
  message: string;
}

export interface IModel {
  api_name: ModelAPINames;
  friendly_name: string;
  description: string;
}

export interface IChatCompletionRequestBody {
  _id: ObjectId;
  new_message: IMessage;
  version_of: number | null; //-- if message is a new version of order_timestamp_unix_ms--//
  model: IModel;
}

/** This list is to be append-only. To prevent the use of a model, limit the models included in the model_options object created in the file where ChatContext is created. */
export type ModelAPINames = "gpt-3.5-turbo" | "gpt-4" | "gpt-4-32k";

export interface IAPIResponse {
  user: string;
  model_api_name: string;
  created_at: Date;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  completion_message_uuid: UUIDV4;
  prompt_message_uuid: UUIDV4;
  request_messages_uuids: UUIDV4[];
}

//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
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
//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
