import { ObjectId } from "bson";

//-- Mongoize - ObjectId and Date --//
// Outside MongoDB - "ObjectId" stored as Hex String
// // new ObjectId().toHexString()

// Inside MongoDB - "ObjectId" stored as ObjectId Object
// // ObjectId.createFromHexString()

// Outside MongoDB - "Date" stored as ISO 8601 string
// // new Date().toISOString() --> '2023-05-06T05:10:00.731Z'

// Inside MongoDB - "Date" stored as Date object
// // new Date('2023-05-06T05:10:00.731Z') --> Date Object

//-- Type Interfaces --//
//-- `conversations` collection --> index on user_db_id --//
export interface IConversation {
  _id: string; //-- {MONGOIZE} ObjectId --//
  created_at: string; //-- {MONGOIZE} Date --//
  last_edited: string; //-- {MONGOIZE} Date --//
  api_provider_name: APIProviderNames;
  model_developer_name: ModelDeveloperNames;
  user_db_id: string;
  title: string;
  root_node_id: string; //-- ObjectId --//
  schema_version: string;
  api_req_res_metadata: IAPIReqResMetadata[];
  system_tags: string[]; //-- predefined lists for favorites, etc. --//
  user_tags: string[]; //-- user-defined tags --//
}
export interface IConversation_Mongo {
  _id: ObjectId; //-- MONGOIZED --//
  created_at: Date; //-- MONGOIZED --//
  last_edited: Date; //-- MONGOIZED --//
  api_provider_name: APIProviderNames;
  model_developer_name: ModelDeveloperNames;
  user_db_id: string;
  title: string;
  root_node_id: string;
  schema_version: string;
  api_req_res_metadata: IAPIReqResMetadata[];
  system_tags: string[];
  user_tags: string[];
}

//-- `message_nodes` collection --> index on conversation_id: 1, created_at: -1 --//
export interface IMessageNode {
  _id: string; //-- {MONGOIZE} ObjectId --//
  conversation_id: string; //-- {MONGOIZE} ObjectId --//
  created_at: string; //-- {MONGOIZE} Date --//
  user_db_id: string;
  parent_node_id: string | null; //-- ObjectId --//
  children_node_ids: string[]; //-- ObjectId[] --//
  prompt: IMessage;
  completion: IMessage | null;
}
export interface IMessageNode_Mongo {
  _id: ObjectId; //-- MONGOIZED --//
  conversation_id: ObjectId; //-- MONGOIZED --//
  created_at: Date; //-- MONGOIZED --//
  user_db_id: string;
  parent_node_id: string | null;
  children_node_ids: string[];
  prompt: IMessage;
  completion: IMessage | null;
}

export interface IMessage {
  author: string;
  model: IModel;
  created_at: string; //-- Date --//
  role: ChatCompletionResponseMessageRoleEnum;
  content: string;
}

export interface IMessageRow extends IMessage {
  prompt_or_completion: "prompt" | "completion";
  node_id: string; //-- ObjectId --//
  sibling_node_ids: string[]; //-- ObjectId[] --//
  // author: string;
  // model: IModel;
  // created_at: string; //-- Date --//
  // role: ChatCompletionResponseMessageRoleEnum;
  // content: string;
}

export interface IModel {
  api_provider_name: APIProviderNames;
  model_developer_name: ModelDeveloperNames;
  model_api_name: ModelAPINames;
}

export type IModelFriendly = {
  api_provider_friendly_name: string;
  model_developer_friendly_name: string;
  model_developer_link: string;
  model_friendly_name: string;
  model_description: string;
};

export interface IAPIReqResMetadata {
  user: string;
  model_api_name: string;
  params: {
    temperature?: number | null;
    [key: string]: any; //-- Index signature for additional parameters --//
  };
  created_at: string;
  request_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  node_id: string; //-- ObjectId --//
  request_messages_node_ids: string[]; //-- ObjectId[] --//
}

export interface IChatCompletionRequestBody_OpenAI {
  prompt: IMessage;
  conversation_id_string: string | null;
  parent_node_id_string: string | null;
  temperature: number | null; //-- between 0 and 2, inclusive --//
}

/** These lists is to be append-only. To prevent the use of a model, limit the models included in the model_options object created in the file where ChatContext is created. */
export type APIProviderNames = "openai" | "amazon_bedrock";

export type ModelDeveloperNames =
  | "openai"
  | "ai21labs"
  | "anthropic"
  | "stability_ai"
  | "amazon";
// export type ModelDeveloperFriendlyName = "OpenAI" | "AI21 Labs" | "Anthropic" | "stability.ai" | "Amazon"

export type ModelAPINames =
  | "gpt-3.5-turbo"
  | "gpt-4"
  | "gpt-4-32k"
  | "claude"
  | "jurrasic-2"
  | "amazon-titan";

//----//
export interface IOpenAILLMParams
  extends Omit<CreateChatCompletionRequest, "model" | "messages"> {}

//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- ***** ***** ***** ***** ***** ***** ***** ***** ***** --//
//-- (2023-04-30) Copy-pasted from OpenAI NodeSDK
/**
 *
 * @export
 * @interface CreateChatCompletionRequest
 */
export interface CreateChatCompletionRequest {
  /**
   * ID of the model to use. Currently, only `gpt-3.5-turbo` and `gpt-3.5-turbo-0301` are supported.
   * @type {string}
   * @memberof CreateChatCompletionRequest
   */
  model: string;
  /**
   * The messages to generate chat completions for, in the [chat format](/docs/guides/chat/introduction).
   * @type {Array<ChatCompletionRequestMessage>}
   * @memberof CreateChatCompletionRequest
   */
  messages: Array<ChatCompletionRequestMessage>;
  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.  We generally recommend altering this or `top_p` but not both.
   * @type {number}
   * @memberof CreateChatCompletionRequest
   */
  temperature?: number | null;
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.  We generally recommend altering this or `temperature` but not both.
   * @type {number}
   * @memberof CreateChatCompletionRequest
   */
  top_p?: number | null;
  /**
   * How many chat completion choices to generate for each input message.
   * @type {number}
   * @memberof CreateChatCompletionRequest
   */
  n?: number | null;
  /**
   * If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message.
   * @type {boolean}
   * @memberof CreateChatCompletionRequest
   */
  stream?: boolean | null;
  /**
   *
   * @type {CreateChatCompletionRequestStop}
   * @memberof CreateChatCompletionRequest
   */
  stop?: CreateChatCompletionRequestStop;
  /**
   * The maximum number of tokens allowed for the generated answer. By default, the number of tokens the model can return will be (4096 - prompt tokens).
   * @type {number}
   * @memberof CreateChatCompletionRequest
   */
  max_tokens?: number;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model\'s likelihood to talk about new topics.  [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)
   * @type {number}
   * @memberof CreateChatCompletionRequest
   */
  presence_penalty?: number | null;
  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model\'s likelihood to repeat the same line verbatim.  [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)
   * @type {number}
   * @memberof CreateChatCompletionRequest
   */
  frequency_penalty?: number | null;
  /**
   * Modify the likelihood of specified tokens appearing in the completion.  Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
   * @type {object}
   * @memberof CreateChatCompletionRequest
   */
  logit_bias?: object | null;
  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
   * @type {string}
   * @memberof CreateChatCompletionRequest
   */
  user?: string;
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
