//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components and Functions ==//
import { list_conversations } from "./list_conversations";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios from "axios";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IChatContext } from "../../../../Context/ChatContext";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

export async function retitle_conversation(
  access_token: string,
  CC: IChatContext,
  conversation_id: string,
  new_title: string
): Promise<void> {
  try {
    await axios.post(
      `${VITE_ALB_BASE_URL}/llm/retitle`,
      { conversation_id: conversation_id, new_title: new_title },
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    );
    await list_conversations(access_token, CC, "overwrite");
  } catch (err) {
    throw err;
  }
}
