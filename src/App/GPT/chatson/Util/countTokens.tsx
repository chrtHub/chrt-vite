/**
 * A faster alternative to tiktoken. Estimates tokens in a string by counting 4 chars as a token.
 */
export function countTokens(message: string): number {
  const tokenLength = 4.7;
  const messageLength = message.length;
  const tokens = Math.ceil(messageLength / tokenLength);

  return tokens;
}
