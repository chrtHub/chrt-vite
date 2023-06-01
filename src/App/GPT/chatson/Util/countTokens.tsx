/**
 * A faster alternative to tiktoken. Estimates tokens in a string by counting 4.7 chars (client-side) or 4.5 chars (server-side) as a token. The server counts faster (more strictly).
 */
export function countTokens(message: string): number {
  const clientSideTokenLength = 4.7;
  // const serverSideTokenLength = 4.6;
  const messageLength = message.length;
  const tokens = Math.ceil(messageLength / clientSideTokenLength);

  return tokens;
}
