import { ObjectId, UUID } from "bson";

//-- Type Interfaces --//
export interface IConversation {
  _id: ObjectId;
  llm_provider: LLMProvider;
  user_db_id: string;
  title: string;
  root_node_id: ObjectId;
  schema_version: string;
  created_at: Date;
  api_req_res_metadata: IAPIReqResMetadata[];
  system_tags: string[]; //-- predefined lists for favorites, etc. --//
  user_tags: string[]; //-- user-defined tags --//
}
//-- `conversations` collection --> index on user_db_id --//

export interface IMessageNode {
  _id: ObjectId;
  user_db_id: string;
  created_at: Date;
  conversation_id: ObjectId;
  parent_node_id: ObjectId | null;
  children_node_ids: ObjectId[];
  prompt: IMessage;
  completion: IMessage | null;
}
//-- `message_nodes` collection --> index on conversation_id --//

export interface IMessage {
  author: string;
  model: IModel;
  created_at: Date;
  role: ChatCompletionResponseMessageRoleEnum;
  content: string;
}

export interface IMessageRow extends IMessage {
  node_id: ObjectId;
  sibling_node_ids: ObjectId[];
}

export interface IModel {
  api_name: ModelAPINames;
  friendly_name: string;
  description: string;
}

export interface IAPIReqResMetadata {
  user: string;
  model_api_name: string;
  created_at: Date;
  request_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  node_id: ObjectId;
  request_messages_node_ids: ObjectId[];
}

export interface IChatCompletionRequestBody {
  prompt: IMessage;
  conversation_id: ObjectId | null;
  parent_node_id: ObjectId | null;
}

/** This list is to be append-only. To prevent the use of a model, limit the models included in the model_options object created in the file where ChatContext is created. */
export type ModelAPINames = "gpt-3.5-turbo" | "gpt-4" | "gpt-4-32k";
export type LLMProvider = "openai" | "amazon-bedrock";

export interface IOpenAIChatCompletionsRequestBody {
  model: ModelAPINames;
  messages: ChatCompletionRequestMessage[];
  stream: boolean;
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
