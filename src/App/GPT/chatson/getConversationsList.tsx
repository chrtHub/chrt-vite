import axios from "axios";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import { IConversationSerialized } from "./chatson_types";

/**
 *
 * @param accessToken user's access token
 * @param skip the number of documents to skip when returning results. equal to the length of the conversations array.
 * @returns
 */
export default async function getConversationsList(
  accessToken: string,
  skip: number
): Promise<IConversationSerialized[] | null> {
  try {
    //-- Get access token from memory or request new token --//

    //-- Make POST request --//
    let res = await axios.get<IConversationSerialized[] | null>(
      `${VITE_ALB_BASE_URL}/llm/list_conversations/${skip}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
    //----//
  } catch (err) {
    console.log(err);
  }

  return null;
}
