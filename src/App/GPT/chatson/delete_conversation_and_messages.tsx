//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components and Functions ==//
import { reset_conversation } from "./reset_conversation";
import { list_conversations } from "./list_conversations";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios from "axios";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IChatContext } from "../../../Context/ChatContext";
import { NavigateFunction } from "react-router-dom";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

/**
 * (5) delete_conversation_and_messages causes deletion of all message nodes and the conversation object by conversation_id
 *
 * @param access_token
 * @param conversation_id
 * @param CC
 */
export async function delete_conversation_and_messages(
  access_token: string,
  conversation_id: string,
  CC: IChatContext,
  navigate: NavigateFunction
): Promise<void> {
  try {
    console.log("--- delete_conversations ---");
    //-- Make GET request --//
    await axios.delete(
      `${VITE_ALB_BASE_URL}/llm/delete_conversation_and_messages/${conversation_id}`,
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    );
    //-- If current conversation was deleted, reset conversation --//
    if (CC.conversationId === conversation_id) {
      reset_conversation(CC, navigate);
    }
    //-- Fetch updated conversations list --//
    await list_conversations(access_token, CC, "overwrite");
  } catch (err) {
    throw err;
  }
}
