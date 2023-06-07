//== react, react-router-dom, Auth0 ==//

//== TSX Components ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios from "axios";

//== Utility Functions ==//

import {
  nodeArraySet,
  nodeArrayGetNewestNode,
  nodeArrayToRowArray,
} from "./../nodeArray";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IConversation, IMessageNode } from "./../chatson_types";
import { IChatContext } from "../../../../Context/ChatContext";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

export async function get_conversation_and_messages(
  access_token: string,
  conversation_id: string,
  CC: IChatContext
): Promise<void> {
  try {
    //-- Make GET request --//
    let res = await axios.get<{
      conversation: IConversation;
      message_nodes: IMessageNode[];
    }>(
      `${VITE_ALB_BASE_URL}/conversation/get_conversation_and_messages/${conversation_id}`,
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    );
    let { conversation, message_nodes } = res.data;

    //-- Update conversation --//
    CC.setConversation(conversation);

    //-- If messages received, update CC.model, CC.rowArray, and local nodeArray --/
    if (message_nodes.length > 0) {
      //-- Update nodeArray --//
      nodeArraySet(message_nodes);
      //-- Set newest node as the leaf node  --//
      let leaf_node = nodeArrayGetNewestNode();
      //-- Set model to match leaf node's model --//
      if (leaf_node.completion?.model) {
        CC.setModel(leaf_node.completion.model);
      }
      //-- Update rowArray --//
      let rowArray = nodeArrayToRowArray(leaf_node);
      CC.setRowArray(rowArray);
    }
    //----//
  } catch (err) {
    throw err;
  }
}
