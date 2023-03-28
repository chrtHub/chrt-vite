export interface IChatsonMessage {
  role: string;
  author: string;
  timestamp: string;
  message_uuid: string;
  content: string;
}

// TODO - specify the Record type for this interface
export interface IChatsonAPICall extends Record<string, any> {}

export interface IChatsonObject {
  chatson_version: string;
  notes: {
    metadata: string; // Corrected property name
    linear_message_history: string;
    api_call_history: string;
  };
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
  api_call_history: IChatsonAPICall[];
}
