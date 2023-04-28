//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import { produce } from "immer";
import { fetchEventSource } from "@microsoft/fetch-event-source";

//== Utility Functions ==//
import { getUserDbId } from "../../../Util/getUserDbId";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import {
  IAPIReqResMetadata,
  IConversation,
  IMessageNode,
  IMessageRow,
  IMessage,
  IChatCompletionRequestBody,
} from "./chatson_types";
import { IChatContext } from "../../../Context/ChatContext";
import { ObjectId } from "bson";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Chatson stuff --//
let leafNodeIdString: string | null = null; //-- string is ObjectId.toString() --//
let nodeArray: IMessageNode[] = [];
let nodeMap: Record<string, IMessageNode> = {};

/**
 * Causes an LLM API call after adding a propmt to a chatson object
 *
 * @param access_token (a) set as the author id, (b) sent as Bearer token in 'authorization' header
 * @param prompt_content user input to be added to the conversation
 * @param parent_node_id For new conversations, the parent_node is null. For creating a message on the same branch, the parent_node is the current leaf node. For creating a message on a new branch, the parent_node is the parent of the current leaf node.
 * @param CC chat context
 * @returns IChatsonObject updated with the new prompt
 */
export function send_message(
  access_token: string,
  prompt_content: string,
  parent_node_id: ObjectId | null,
  CC: IChatContext
) {
  console.log(" ----- SEND MESSAGE ----- "); // DEV

  //-- Get user_db_id from access token --//
  let user_db_id = getUserDbId(access_token);

  //-- Build prompt --//
  let prompt: IMessage = {
    author: user_db_id,
    model: CC.model,
    created_at: new Date(),
    role: "user",
    content: prompt_content,
  };

  //-- Build request_body --//
  let request_body: IChatCompletionRequestBody = {
    prompt: prompt,
    conversation_id: CC.conversation?._id || null,
    parent_node_id: parent_node_id,
  };

  //-- Headers --//
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  class CustomFatalError extends Error {} // TODO - build as needed
  try {
    // DEV - removed await before fetchEventSource
    fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(request_body),
      async onopen(res) {
        //-- Conversation id --//
        let conversation_id: ObjectId;
        let a = res.headers.get("CHRT-conversation-id");
        if (a) {
          conversation_id = ObjectId.createFromHexString(a);
        } else {
          throw new CustomFatalError("missing conversation_id");
        }

        //-- Root node (new conversations only) --//
        let b = res.headers.get("CHRT-root-node-id");
        let c = res.headers.get("CHRT-root-node-created-at");
        if (b && c) {
          console.log("root node found"); // DEV
          let root_node_id: ObjectId = ObjectId.createFromHexString(b);
          let root_node_created_at: Date = new Date(c);

          //-- Build root node --//
          let root_node: IMessageNode = {
            _id: root_node_id,
            user_db_id: user_db_id,
            created_at: root_node_created_at,
            conversation_id: conversation_id,
            parent_node_id: null,
            children_node_ids: [],
            prompt: {
              author: "chrt",
              model: CC.model,
              created_at: root_node_created_at,
              role: "system",
              content: "(server-side only)",
            },
            completion: null,
          };

          //-- Add root node to nodeArray --//
          nodeArray.push(root_node);
        }

        //-- New node --//
        let d = res.headers.get("CHRT-new-node-id");
        let e = res.headers.get("CHRT-new-node-created-at");
        let f = res.headers.get("CHRT-parent-node-id");
        if (!d || !e || !f) {
          throw new CustomFatalError("missing header(s)");
        }
        let new_node_id: ObjectId = ObjectId.createFromHexString(d);
        let new_node_created_at: Date = new Date(e); // TODO - VERIFY THIS
        let parent_node_id: ObjectId = ObjectId.createFromHexString(f);

        //-- Build prompt node --//
        let completion: IMessage = {
          author: CC.model.api_name,
          model: CC.model,
          created_at: new Date(),
          role: "assistant",
          content: "",
        };
        let new_node: IMessageNode = {
          _id: new_node_id,
          user_db_id: user_db_id,
          created_at: new_node_created_at,
          conversation_id: conversation_id,
          parent_node_id: parent_node_id,
          children_node_ids: [],
          prompt: prompt,
          completion: completion,
        };

        //-- Update order: --//
        //-- leafNode sometime before rowArray --//
        //-- nodeArray --> nodeMap --> rowArray --//

        //-- Update leaf node --//
        leafNodeIdString = new_node._id.toString();

        //-- Update nodeArray --//
        //-- Find parent node - can't use node map here because the actual node inside the array is to be updated via immer --//
        const parentNode = nodeArray.find((node) =>
          node._id.equals(parent_node_id)
        );
        //-- Add new node's id to children array --//
        if (parentNode) {
          parentNode.children_node_ids.push(new_node._id);
        }
        nodeArray.push(new_node);

        //-- Update CC.nodeMap --//
        nodeMap = {}; //-- reset --//
        nodeArray.forEach((node) => {
          nodeMap[node._id.toString()] = node; //-- populate --//
        });

        //-- Update CC.rowsArray --//
        let new_rows_array: IMessageRow[] = []; //-- Build new rows array --//
        let node: IMessageNode = nodeMap[leafNodeIdString]; //-- Start with new leaf node --//

        //-- Loop until reaching the root node where parent_node_id is null --//
        while (node.parent_node_id) {
          let parent_node = nodeMap[node.parent_node_id.toString()];

          //-- Sort parent's children by timestamp ascending --//
          let sibling_ids_timestamp_asc: ObjectId[] = [
            ...parent_node.children_node_ids.sort(
              (a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime()
            ),
          ];

          //-- Build completion row, add to new_rows_array --//
          let completion_row: IMessageRow;
          if (node.completion) {
            completion_row = {
              ...node.completion,
              node_id: node._id,
              sibling_node_ids: [], //-- Use prompt_row for this --//
            };
            new_rows_array.push(completion_row);
          }

          //-- Build prompt row, add to new_rows_array --//
          let prompt_row: IMessageRow = {
            ...node.prompt,
            node_id: node._id,
            sibling_node_ids: [...sibling_ids_timestamp_asc],
          };
          new_rows_array.push(prompt_row);

          //-- Update node --//
          node = parent_node;
        }

        new_rows_array = new_rows_array.reverse(); //-- push + reverse --//

        CC.setRowArray(new_rows_array);
        //----//
      },
      onmessage(event) {
        //-- Error --//
        if (event.id && event.id === "error") {
          console.log("error", event.data); // DEV
          // TODO - implement error handling
        }
        //-- Conversation object (IConversation) --//
        //-- Note - this is only sent for new conversations --//
        else if (event.id && event.id === "conversation") {
          let data: IConversation = JSON.parse(event.data);
          CC.setConversation(data);
        }
        //-- Completion object (IMessage) --//
        else if (event.id && event.id === "completion") {
          let data: IMessage = JSON.parse(event.data);
          // TODO - update completion.
          // overwrite completion object in nodeArray and rowArray.
          // nodeMap stays the same
        }
        //-- API Req/Res Metadata (<IAPIReq></IAPIReq>ResMetadata)
        else if (event.id && event.id === "api_req_res_metadata") {
          let data: IAPIReqResMetadata = JSON.parse(event.data);
          // TODO - add to conversation.api_req_res_metadata?
        }
        //-- SSE completion content chunks --//
        else {
          const uriDecodedData = decodeURIComponent(event.data);
          console.log(uriDecodedData); // DEV

          CC.setRowArray((prevRowArray) => {
            return produce(prevRowArray, (draft) => {
              if (draft) {
                //-- Add message chunk to `content` of last row in rowArray --//
                draft[draft.length - 1].content =
                  draft[draft.length - 1].content + uriDecodedData;
              }
            });
          });
        }
      },
      onclose() {
        console.log("Connection closed by the server"); // DEV
      },
      onerror(err) {
        if (err instanceof CustomFatalError) {
          console.error(err.message);
          throw err; //-- Rethrow error to end request --//
        } else {
          console.log("There was an error from server", err);
        }
      },
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * Change branch -
 *
 * @param
 */
export function change_branch() {
  // Something like this?
  //-- On 'direct' updates to leaf node - via user selecting new conversation branch --//
  // const branchChangeHandler = (
  //   node_id: ObjectId,
  //   sibling_node_ids: ObjectId[],
  //   increment: 1 | -1
  // ) => {
  //   // for a prompt row, display prompt's "sibling_node_ids.indexOf(node_id) + 1 / sibling_node_ids.length", i.e. "1 / 3"
  //   //-- Current node --//
  //   let node_id_idx: number = sibling_node_ids.indexOf(node_id);
  //   //-- New version node --//
  //   let new_version_node_id: ObjectId =
  //     sibling_node_ids[node_id_idx + increment];
  //   let new_version_node: IMessageNode =
  //     node_map[new_version_node_id.toString()];
  //   //-- Find leaf node --//
  //   let new_leaf_node_id = findLeafNodeId(new_version_node);
  //   //-- Update leaf node state --//
  //   // DEV - this state never consumed before updated inside chatson?
  //   CC.setLeafNodeIdString((prevState) =>
  //     produce(prevState, (draft) => {
  //       draft = new_leaf_node_id.toString();
  //     })
  //   );
  //   //-- Call updateRowsArray (not relying on ChatContext state here) --//
  //   buildRowArray(new_leaf_node_id.toString());
  // };
  // function findLeafNodeId(node: IMessageNode): ObjectId {
  //   //-- Leaf node (only searching "1st child history") --//
  //   if (node.children_node_ids.length === 0) {
  //     return node._id;
  //   }
  //   //-- Not leaf node --//
  //   else {
  //     const first_child_node = node_map[node.children_node_ids[0].toString()];
  //     return findLeafNodeId(first_child_node);
  //   }
  // }
  // const buildRowArray = (newLeafNodeIdString: string) => {
  //   //-- initialize stuff --//
  //   let node: IMessageNode;
  //   let parent_node: IMessageNode;
  //   let new_rows_array: IMessageRow[] = [];
  //   //-- Start with new leaf node --//
  //   node = node_map[newLeafNodeIdString];
  //   //-- Loop until reaching the root node where parent_node_id is null --//
  //   while (node.parent_node_id) {
  //     parent_node = node_map[node.parent_node_id.toString()];
  //     //-- Sort parent's children by timestamp ascending --//
  //     let sibling_ids_timestamp_asc: ObjectId[] = [
  //       ...parent_node.children_node_ids.sort(
  //         (a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime()
  //       ),
  //     ];
  //     //-- Build completion row, add to new_rows_array --//
  //     let completion_row: IMessageRow;
  //     if (node.completion) {
  //       completion_row = {
  //         ...node.completion,
  //         node_id: node._id,
  //         sibling_node_ids: [], //-- Use prompt_row for this --//
  //       };
  //       new_rows_array.push(completion_row);
  //     }
  //     //-- Build prompt row, add to new_rows_array --//
  //     let prompt_row: IMessageRow = {
  //       ...node.prompt,
  //       node_id: node._id,
  //       sibling_node_ids: [...sibling_ids_timestamp_asc],
  //     };
  //     new_rows_array.push(prompt_row);
  //     //-- Update node --//
  //     node = parent_node;
  //   }
  //   //-- Update state --//
  //   CC.setRowArray((prevRowArray) => {
  //     new_rows_array = new_rows_array.reverse(); //-- push + reverse --//
  //     return produce(prevRowArray, (draft) => {
  //       draft = new_rows_array;
  //     });
  //   });
  // };
}

export function reset_conversation() {
  // TODO
}
