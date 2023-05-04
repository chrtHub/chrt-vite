//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import { produce } from "immer";
import { fetchEventSource } from "@microsoft/fetch-event-source";

//== Utility Functions ==//
import { getUserDbId } from "../../../Util/getUserDbId";
import getConversationsList from "./getConversationsList";

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
import { IConversationsContext } from "../../../Context/ConversationsContext";
import { ObjectId } from "bson";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Chatson stuff --//
let nodeArray: IMessageNode[] = [];
let nodeMap: Record<string, IMessageNode> = {};

//-- send_message() outline --//
// (0) nodeArray available within the global scope of chatson, persists unless reset

// (1) Receive: prompt content, parent node id (existing conversation), CC.rowArray

// (2) Build prompt IMessage object and request_body IChatCompletionRequestBody object, call fetchEventSource with request_body.

// (3a) All conversations - <onopen></onopen>
// // get headers for conversation id
// (3b) New conversations - onopen
// // get headers for root node, build root node, add it to nodeArray
// (3c) All conversations - onopen
// // get headers for new node and parent_node_id
// // build completion IMessage object and new_node IMessageNode object
// // add new_node to nodeArray
// // add new_node's id to parent node's children node ids in nodeArray

// (4) build newRowArray
// // starting from new_node, find each parent node, stopping when the next parent node is root node
// // for each prompt row, find the parent node's children and add them to prompt row's sibling_node_ids
// // build completion IMessageRow and push onto newRowArray
// // build prompt IMessageRow and push onto newRowArray
// // reverse newRowArray and set at CC.rowArray

// (5a) New Conversations - onmessage
// // (i) set the conversation object in ChatContext state
// (5b) All conversastions - onmessage
// // (i) message chunk events
// // URI decode the content and append to last message's content in rowArray via setState
// // (ii) completion event
// // parse stringified JSON into completion IMessage object
// // overwrite completion IMessage object in nodeArray
// // overwrite completion content in rowArray
// // (iii) api_req_res_metadata event
// // parse stringified JSON into api_req_res_metadata_object
// // add to conversation's api_req_res_metadata array in state

/**
 * send_message sends a prompt to an LLM and receives the response
 *
 * @param access_token (a) set as the author id, (b) sent as Bearer token in 'authorization' header
 * @param prompt_content user input to be added to the conversation
 * @param parent_node_id For new conversations, the parent_node is null. For creating a message on the same branch, the parent_node is the current leaf node. For creating a message on a new branch, the parent_node is the parent of the current leaf node.
 * @param CC chat context
 * @param ConversationsContext conversations context
 * @returns IChatsonObject updated with the new prompt
 */
export async function send_message(
  access_token: string,
  prompt_content: string,
  parent_node_id: ObjectId | null,
  CC: IChatContext,
  ConversationsContext: IConversationsContext
) {
  console.log(" ----- SEND MESSAGE ----- "); // DEV
  console.log(CC.temperature);

  //-- Get user_db_id from access token --//
  const user_db_id = getUserDbId(access_token);

  //-- Build prompt --//
  const prompt: IMessage = {
    author: user_db_id,
    model: CC.model,
    created_at: new Date(),
    role: "user",
    content: prompt_content,
  };

  //-- Build request_body --//
  const request_body: IChatCompletionRequestBody = {
    prompt: prompt,
    conversation_id_string: CC.conversation?._id.toString() || null,
    parent_node_id_string: parent_node_id?.toString() || null,
    temperature: CC.temperature,
  };

  //-- Headers --//
  const request_headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  let new_node_id: ObjectId;
  let new_conversation: boolean = false;

  class CustomFatalError extends Error {} // TODO - build as needed
  try {
    fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
      method: "POST",
      headers: request_headers,
      body: JSON.stringify(request_body),
      //-- ***** ***** ***** ***** ONOPEN ***** ***** ***** ***** --//
      //-- ***** ***** ***** ***** ------ ***** ***** ***** ***** --//
      async onopen(res) {
        //-- Conversation id --//
        let conversation_id: ObjectId;
        const a = res.headers.get("CHRT-conversation-id");
        if (a) {
          conversation_id = ObjectId.createFromHexString(a);
        } else {
          throw new CustomFatalError("missing conversation_id");
        }

        //-- Root node (new conversations only) --//
        const b = res.headers.get("CHRT-root-node-id");
        const c = res.headers.get("CHRT-root-node-created-at");
        if (b && b !== "none" && c && c !== "none") {
          new_conversation = true;
          const root_node_id: ObjectId = ObjectId.createFromHexString(b);
          const root_node_created_at: Date = new Date(c);

          //-- Build root node --//
          const root_node: IMessageNode = {
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
        const d = res.headers.get("CHRT-new-node-id");
        const e = res.headers.get("CHRT-new-node-created-at");
        const f = res.headers.get("CHRT-parent-node-id");
        if (!d || !e || !f) {
          throw new CustomFatalError("missing header(s)");
        }
        new_node_id = ObjectId.createFromHexString(d);
        const new_node_created_at: Date = new Date(e);
        const parent_node_id: ObjectId = ObjectId.createFromHexString(f);

        //-- Build prompt node --//
        const completion: IMessage = {
          author: CC.model.model_api_name,
          model: CC.model,
          created_at: new Date(),
          role: "assistant",
          content: "", //-- overwritten in CC.rowArray during SSE --//
        };
        const new_node: IMessageNode = {
          _id: new_node_id,
          user_db_id: user_db_id,
          created_at: new_node_created_at,
          conversation_id: conversation_id,
          parent_node_id: parent_node_id,
          children_node_ids: [],
          prompt: prompt,
          completion: completion,
        };

        //-- Add new_node to nodeArray, update parent node's children_node_ids --//
        nodeArray = produce(nodeArray, (draft) => {
          draft.push(new_node);

          let parent_node_in_draft = draft.find((node) =>
            node._id.equals(parent_node_id)
          );
          if (parent_node_in_draft) {
            parent_node_in_draft.children_node_ids.push(new_node._id);
          }
        });

        //-- Update CC.nodeMap --//
        nodeMap = {}; //-- reset --//
        nodeArray.forEach((node) => {
          nodeMap[node._id.toString()] = node; //-- populate --//
        });

        //-- Build newRowArray and set as CC.rowsArray --//
        let newRowArray: IMessageRow[] = []; //-- Build new rows array --//
        let node: IMessageNode = nodeMap[new_node._id.toString()]; //-- Start with new node --//

        //-- Loop until reaching the root node where parent_node_id is null --//
        while (node.parent_node_id) {
          let parent_node = nodeMap[node.parent_node_id.toString()];

          //-- Sort parent's children by timestamp ascending --//
          let sibling_ids_timestamp_asc: ObjectId[] = [
            ...parent_node.children_node_ids.sort(
              (a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime()
            ),
          ];

          //-- Build completion row, add to newRowArray --//
          let completion_row: IMessageRow;
          if (node.completion) {
            completion_row = {
              ...node.completion,
              prompt_or_completion: "completion",
              node_id: node._id,
              sibling_node_ids: [], //-- Use prompt_row for this --//
            };
            newRowArray.push(completion_row);
          }

          //-- Build prompt row, add to newRowArray --//
          let prompt_row: IMessageRow = {
            ...node.prompt,
            prompt_or_completion: "prompt",
            node_id: node._id,
            sibling_node_ids: [...sibling_ids_timestamp_asc],
          };
          newRowArray.push(prompt_row);

          //-- Update node --//
          node = parent_node;
        }

        newRowArray = newRowArray.reverse(); //-- push + reverse --//

        CC.setRowArray(newRowArray);
        //----//
      },
      //-- ***** ***** ***** ***** ONMESSAGE ***** ***** ***** ***** --//
      //-- ***** ***** ***** ***** --------- ***** ***** ***** ***** --//
      onmessage(event) {
        //-- Error --//
        if (event.id && event.id === "error") {
          // TODO - implement error handling
        }
        //-- Conversation object (IConversation) --//
        else if (event.id && event.id === "conversation") {
          //-- Note - this is only sent for new conversations --//
          let data: IConversation = JSON.parse(event.data);
          CC.setConversation(data);
        }
        //-- Completion object (IMessage) --//
        else if (event.id && event.id === "completion") {
          let completion_object: IMessage = JSON.parse(event.data);
          //-- Overwrite completion object in nodeArray --//
          nodeArray = produce(nodeArray, (draft) => {
            let new_node_in_draft = draft.find((node) => {
              return node._id.equals(new_node_id);
            });
            if (new_node_in_draft) {
              new_node_in_draft.completion = completion_object;
            }
          });
          //-- Overwrite completion content in rowArray --//
          CC.setRowArray((prevRowArray) => {
            return produce(prevRowArray, (draft) => {
              if (draft) {
                draft[draft.length - 1].content = completion_object.content;
              }
            });
          });
        }
        //-- API Req/Res Metadata (<IAPIReq></IAPIReq>ResMetadata)
        else if (event.id && event.id === "api_req_res_metadata") {
          let api_req_res_metadata_object: IAPIReqResMetadata = JSON.parse(
            event.data
          );
          //-- Add api_req_res_metadata_object to conversation object --//
          CC.setConversation((prevConversation) => {
            return produce(prevConversation, (draft) => {
              if (draft) {
                draft.api_req_res_metadata.push(api_req_res_metadata_object);
              }
            });
          });
        }
        //-- SSE completion content chunks --//
        else {
          const uriDecodedData = decodeURIComponent(event.data);
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
      //-- ***** ***** ***** ***** ONCLOSE ***** ***** ***** ***** --//
      onclose() {
        console.log("Connection closed by the server"); // DEV

        //-- If new conversation, update conversations list --//
        if (new_conversation) {
          console.log("new conversation --> updating conversations list"); // DEV
          const getConversationsListHandler = async () => {
            let list = await getConversationsList(
              access_token,
              ConversationsContext.conversationsArray?.length || 0
            );
            ConversationsContext.setConversationsArray(list);
          };
          getConversationsListHandler();
        }
      },
      //-- ***** ***** ***** ***** ONERROR ***** ***** ***** ***** --//
      onerror(err) {
        if (err instanceof CustomFatalError) {
          console.error(err.message);
          throw err; //-- Rethrow error to end request --//
        } else {
          console.log("There was an error:", err);
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

/**
 * change_conversation() will
 */
export function change_conversation() {
  // TODO
}

export function reset_conversation() {
  // TODO
}
