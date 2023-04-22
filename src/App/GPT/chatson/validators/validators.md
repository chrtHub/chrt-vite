### Create a validator and add it to a collection in MongoDB

- Prompt ChatGPT
- Template:

```txt
Use this to create a JSON Schema for MongoDB Schema validation of the IConversation type of objects to be stored in the database "chrtgpt-journal" in collection "conversations":

<<PASTE TYPE INTERFACES HERE>>
```

- 2023-04-20 Example:

```txt
Use this to create a JSON Schema for MongoDB Schema validation of the IConversation type of objects to be stored in the database "chrtgpt-journal" in collection "conversations":

//-- Chatson Type Interfaces --//
export interface IConversation {
  conversation_uuid: UUIDV4;
  message_order: IMessageOrder;
  messages: IMessages;
  api_responses: IAPIResponse[];
  schema_version: string;
}

type UUIDV4 = string & {
  //-- UUIDv4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx --//
  //-- where x is any hexadecimal digit and y is one of 8, 9, A, or B --//
  readonly _uuidBrand: unique symbol;
};

export interface IMessageOrder {
  [order: number]: {
    [version: number]: UUIDV4;
  };
}

export interface IMessages {
  [uuid: UUIDV4]: IMessage;
}

export interface IMessage {
  message_uuid: UUIDV4;
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

export interface IChatCompletionRequestBody {
  conversation_uuid: UUIDV4;
  request_messages: ChatCompletionRequestMessage[]; // TO BE DEPRACATED
  new_message: IMessage;
  new_message_order: number | null;
  model: IModel;
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
  completion_message_uuid: UUIDV4;
  message_uuids: UUIDV4[];
}
```
