import { get_encoding } from "@dqbd/tiktoken";

//-- NOTES --//
//-- The details for token counting are subject to change --//
//-- 'cl100k_base' is used for 'gpt-4' and 'gpt-3.5-turbo', see here: https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb --//

export function tiktoken(message: string): number {
  const encoder = get_encoding("cl100k_base");
  let encoded = encoder.encode(message);

  //-- Add 10 for cushion because some stuff gets added to messages(?) --//
  let tokens = encoded.length + 10;
  return tokens;
}
