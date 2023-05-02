import axios from "axios";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import { IConversationSerialized } from "./chatson_types";

export default async function getConversationsList(
  accessToken: string
): Promise<IConversationSerialized[] | null> {
  try {
    //-- Get access token from memory or request new token --//

    //-- Make POST request --//
    let res = await axios.get(`${VITE_ALB_BASE_URL}/llm/list_conversations`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
    //----//
  } catch (err) {
    console.log(err);
  }

  return null;
}
