import { TokenLimit } from "./chatson_types";

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
