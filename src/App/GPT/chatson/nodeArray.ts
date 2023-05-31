import { IMessage, IMessageNode, IMessageRow } from "./chatson_types";
import { ObjectId } from "bson";

let nodeArray: IMessageNode[] = [];

export const nodeArrayGet = () => {
  return nodeArray;
};

export const nodeArrayPush = (element: IMessageNode) => {
  nodeArray.push(element);
};

export const nodeArrayAddChildToNode = (node_id: string, child_id: string) => {
  let parent_node = nodeArray.find((node) => node._id === node_id);
  if (parent_node) {
    parent_node.children_node_ids.push(child_id);
  }
};

export const nodeArraySetNodeCompletion = (
  node_id: string | null,
  completion: IMessage
) => {
  let target_node = nodeArray.find((node) => node._id === node_id);
  if (target_node) {
    target_node.completion = completion;
  }
};

export const nodeArraySet = (newArray: IMessageNode[]) => {
  nodeArray = newArray;
};

export const nodeArrayReset = () => {
  nodeArray = [];
};

export const nodeArrayGetNewestNode = (): IMessageNode => {
  let newestNode: IMessageNode = nodeArray[0];
  for (const node of nodeArray) {
    if (node.created_at > newestNode.created_at) {
      newestNode = node;
    }
  }
  return newestNode;
};

export const nodeArrayToRowArray = (leafNode: IMessageNode): IMessageRow[] => {
  const nodeArray = nodeArrayGet();

  //-- Build Node Map --//
  let nodeMap: Record<string, IMessageNode> = {};
  nodeArray.forEach((node) => {
    nodeMap[node._id.toString()] = node; //-- populate --//
  });

  //-- Build newRowArray and set as CC.rowsArray --//
  let newRowArray: IMessageRow[] = []; //-- Build new rows array --//
  let node: IMessageNode = nodeMap[leafNode._id.toString()]; //-- Start with leaf node --//

  //-- Loop until reaching the root node where parent_node_id is null --//
  while (node.parent_node_id) {
    let parent_node = nodeMap[node.parent_node_id.toString()];
    //-- Sort parent's children by timestamp ascending --//
    let sibling_ids_timestamp_asc: string[] = [
      ...parent_node.children_node_ids.sort(
        (a, b) =>
          ObjectId.createFromHexString(a).getTimestamp().getTime() -
          ObjectId.createFromHexString(b).getTimestamp().getTime()
      ),
    ];
    //-- Build completion row, add to newRowArray --//
    let completion_row: IMessageRow;
    if (node.completion) {
      completion_row = {
        ...node.completion,
        prompt_or_completion: "completion",
        node_id: node._id,
        parent_node_id: parent_node._id, // NEW
        sibling_node_ids: [], //-- Use prompt_row for this --//
      };
      newRowArray.push(completion_row);
    }
    //-- Build prompt row, add to newRowArray --//
    let prompt_row: IMessageRow = {
      ...node.prompt,
      prompt_or_completion: "prompt",
      node_id: node._id,
      parent_node_id: parent_node._id, // NEW
      sibling_node_ids: [...sibling_ids_timestamp_asc],
    };
    newRowArray.push(prompt_row);
    //-- Update node --//
    node = parent_node;
  }
  newRowArray = newRowArray.reverse(); //-- push + reverse --//
  return newRowArray;
};
