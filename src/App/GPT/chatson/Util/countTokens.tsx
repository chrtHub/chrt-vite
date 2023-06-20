/**
 * A faster alternative to tiktoken. Estimates tokens in a string by counting 4.7 chars (client-side) or 4.5 chars (server-side) as a token. The server counts faster (more strictly).
 */

// const CLIENT_SIDE_TOKEN_LENGTH = 4.7;
const SERVER_SIDE_TOKEN_LENGTH = 4.6;

export function countTokens(message: string): number {
  const messageLength = message.length;
  const tokens = Math.ceil(messageLength / SERVER_SIDE_TOKEN_LENGTH);

  return tokens;
}

export function getUpToXTokens(message: string, limit: number): string {
  const messageLength = message.length;
  const tokens = Math.ceil(messageLength / SERVER_SIDE_TOKEN_LENGTH);

  if (tokens <= limit) {
    return message;
  } else {
    const maxMessageLength = limit * SERVER_SIDE_TOKEN_LENGTH;
    return message.slice(0, maxMessageLength);
  }
}
