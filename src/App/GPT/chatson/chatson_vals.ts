import { TokenLimit, ResponseBuffer } from "./chatson_types";

const BUFFER: number = 96;

export const TOKEN_LIMITS: TokenLimit = {
  "gpt-3.5-turbo": 4096 - BUFFER,
  "gpt-4": 4096 - BUFFER,
  "gpt-4-32k": 0,
  claude: 0,
  "jurrasic-2": 0,
  "amazon-titan": 0,
  "google-palm-2": 0,
};

//-- Use to limit the total size of request messages so that at least RESPONSE_BUFFER tokens can be returned. The prompt itself can be up to TOKEN_LIMITS tokens, but historical messages won't be added RESPONSE_BUFFER of the model's limit. --//
export const RESPONSE_BUFFERS: ResponseBuffer = {
  "gpt-3.5-turbo": 1096,
  "gpt-4": 1096,
  "gpt-4-32k": 0,
  claude: 0,
  "jurrasic-2": 0,
  "amazon-titan": 0,
  "google-palm-2": 0,
};
