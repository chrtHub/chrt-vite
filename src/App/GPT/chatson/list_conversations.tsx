//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios from "axios";
import { produce } from "immer";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IConversation } from "./chatson_types";
import { IChatContext } from "../../../Context/ChatContext";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

/**
 * (0) list_conversations
 *
 * @param accessToken user's access token
 * @param CC
 * @param skip the number of documents to skip when returning results
 * @returns
 */
export async function list_conversations(
  accessToken: string,
  CC: IChatContext,
  writeOption: "overwrite" | "append"
): Promise<void> {
  console.log("--- list_conversations ---"); // DEV
  let skip = writeOption === "append" ? CC.conversationsArray.length : 0;
  try {
    //-- Make POST request --//
    let res = await axios.get<IConversation[]>(
      `${VITE_ALB_BASE_URL}/llm/list_conversations/${CC.sortBy}/${skip}`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (res.data) {
      if (writeOption === "append") {
        //-- Append results to array (which is sometimes empty) --//
        CC.setConversationsArray((prevArray) => {
          return produce(prevArray, (draft) => {
            draft.push(...res.data);
          });
        });
      } else {
        //-- writeOption === "overwrite" --//
        CC.setConversationsArray(() => [...res.data]);
      }
    }
    CC.setConversationsFetched(true);
    //----//
  } catch (err) {
    CC.setConversationsFetched(true);
    throw err;
  }
}
