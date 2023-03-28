//-- OpenAI Docs for "Create chat completion"
//-- https://platform.openai.com/docs/api-reference/chat/create --//

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
  role: string;
  user: string;
  model: string;
  timestamp: string;
  message_uuid: string;
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
