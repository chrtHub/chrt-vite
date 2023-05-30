//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

import { nodeArrayGet, nodeArrayToRowArray } from "../nodeArray";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IMessageNode } from "../chatson_types";
import { IChatContext } from "../../../../Context/ChatContext";

/**
 * Change branch - rebuilds rowArray by updating the leaf node as a node from among the siblings of the current message
 *
 * @param new_sibling_node_id
 * @param CC
 */
export function change_branch(
  new_sibling_node_id: string,
  CC: IChatContext
): void {
  //-- Find the new sibling node in the nodeArray --//
  const new_sibling_node = nodeArrayGet().find(
    (node) => node._id === new_sibling_node_id
  );

  if (new_sibling_node) {
    let new_leaf_node: IMessageNode;
    //-- If new sibling has no children, it's the leaf node --//
    if (new_sibling_node.children_node_ids.length === 0) {
      new_leaf_node = new_sibling_node;
    }
    //-- Else recursively find the first-born descendants --//
    else {
      new_leaf_node = finalFirstborn(new_sibling_node);
    }
    //-- Use new_leaf_node to build new rowArray and set it in state --//
    const rowArray = nodeArrayToRowArray(new_leaf_node);
    CC.setRowArray(rowArray);
  }
}

function finalFirstborn(node: IMessageNode): IMessageNode {
  while (node.children_node_ids.length > 0) {
    let next_node_id = node.children_node_ids[0]; //-- Firstborn --//
    let next_node = nodeArrayGet().find((node) => node._id === next_node_id);
    if (next_node) {
      node = next_node;
    }
  }
  return node;
}
