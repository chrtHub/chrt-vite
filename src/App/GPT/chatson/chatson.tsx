//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components ==//
import { axiosErrorHandler } from "../../../Errors/axiosErrorHandler";
import {
  ErrorForBoundary,
  ErrorForToast,
  ErrorForChatToast,
} from "../../../Errors/ErrorClasses";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios, { AxiosError } from "axios";
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
  IChatCompletionRequestBody_OpenAI,
} from "./chatson_types";
import { IChatContext } from "../../../Context/ChatContext";
import { ObjectId } from "bson";
import { NavigateFunction } from "react-router-dom";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Chatson stuff --//
let nodeArray: IMessageNode[] = [];

//== DATA STRUCTURES ==//
// `nodeArray` - IMessageNode[] stored locally in this chatson.tsx file
// // use: used to store all IMessageNode objects for the current conversation, no particular order

// `CC.rowArray` - IMessageRow[] | null stored in ChatContext in correct conversation branch order
// // use: directly rendered as <ChatRow /> components by the Virtuoso list

//== METHODS ==//
// (0) list_conversations
// (1) reset_conversation
// (2) get_conversation_and_messages
// (3) create_title
// (3.5) retitle
// (4) send_message
// (5) change_branch
// (6) delete_conversation_and_messages
// Utilities
// (7) nodeArrayToRowArray
// (8) getNewestNode
//== ******* ==//

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
    if (err instanceof AxiosError) {
      axiosErrorHandler(err, "List conversations");
    } else {
      console.log(err);
    }
  }
}

/**
 * (1) reset_conversation
 * TODO
 */
export function reset_conversation(
  CC: IChatContext,
  navigate: NavigateFunction
): void {
  console.log("reset_conversation"); // DEV
  //-- Clear nodeArray and ChatContext values --//
  nodeArray = [];
  CC.setRowArray([]);
  CC.setConversation(null);
  CC.setConversationId(null);
  CC.setTemperature(null);
  CC.setFocusTextarea(true);
  navigate("/gpt");
}

/**
 * (2) get_conversation_and_messages sends a prompt to an LLM and receives the response
 *
 * @param access_token
 * @param conversation_id
 * @param CC chat context
 */
export async function get_conversation_and_messages(
  access_token: string,
  conversation_id: string,
  CC: IChatContext
): Promise<void> {
  try {
    console.log("get_conversation_and_messages"); // DEV
    //-- Make GET request --//
    let res = await axios.get<{
      conversation: IConversation;
      message_nodes: IMessageNode[];
    }>(
      `${VITE_ALB_BASE_URL}/llm/get_conversation_and_messages/${conversation_id}`,
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
      //-- Set newest node as the leaf node  --//
      let leaf_node = getNewestNode(message_nodes);
      //-- Set model to match leaf node's model --//
      if (leaf_node.completion?.model) {
        CC.setModel(leaf_node.completion.model);
      }
      //-- Update nodeArray --//
      nodeArray = message_nodes;
      //-- Update rowArray --//
      let rowArray = nodeArrayToRowArray(message_nodes, leaf_node);
      CC.setRowArray(rowArray);
    }
    //----//
  } catch (err) {
    if (err instanceof AxiosError) {
      axiosErrorHandler(err, "Get conversation");
    } else {
      console.log(err);
    }
  }
}

/**
 * (3)
 *
 * @param access_token
 * @param conversation_id
 */
export async function create_title(
  access_token: string,
  conversation_id: string
): Promise<void> {
  console.log("---- create_title -----");

  try {
    await axios.post<string>(
      `${VITE_ALB_BASE_URL}/openai/create_title`,
      { conversation_id: conversation_id },
      {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }
    );
  } catch (err) {
    if (err instanceof AxiosError) {
      axiosErrorHandler(err, "Create title");
    } else {
      console.log(err);
    }
  }
}

/**
 * (3.5) retitle
 * @param access_token
 * @param CC
 * @param conversation_id
 * @param new_title
 * @return Promise<void>
 */
export async function retitle(
  access_token: string,
  CC: IChatContext,
  conversation_id: string,
  new_title: string
): Promise<void> {
  console.log("----- retitle -----");

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
    if (err instanceof AxiosError) {
      axiosErrorHandler(err, "Retitle");
    } else {
      console.log(err);
    }
  }
}

/**
 * (4) send_message sends a prompt to an LLM and receives the response
 *
 * @param access_token (a) set as the author id, (b) sent as Bearer token in 'authorization' header
 * @param prompt_content user input to be added to the conversation
 * @param parent_node_id For new conversations, the parent_node is null. For creating a message on the same branch, the parent_node is the current leaf node. For creating a message on a new branch, the parent_node is the parent of the current leaf node.
 * @param CC chat context
 * @param setPromptDraft clears prompt draft if the request to Express returns a 200 onopen
 * @param navigate function returned by react-router v6 useNavigate hook
 */
export async function send_message(
  access_token: string,
  prompt_content: string,
  parent_node_id: string | null,
  CC: IChatContext,
  setPromptDraft?: React.Dispatch<React.SetStateAction<string>>,
  navigate?: NavigateFunction
): Promise<void> {
  console.log(" ----- SEND MESSAGE ----- "); // DEV
  //-- Get user_db_id from access token --//
  const user_db_id = getUserDbId(access_token);

  //-- Build prompt --//
  const prompt: IMessage = {
    author: user_db_id,
    model: CC.model,
    created_at: new Date().toISOString(),
    role: "user",
    content: prompt_content,
  };

  //-- Build request_body --//
  const request_body: IChatCompletionRequestBody_OpenAI = {
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

  let new_conversation: boolean = Boolean(!CC.conversation);
  let new_conversation_id: string | null = null;
  let new_node_id: string | null;
  let completion_content: string = ""; // NEW

  await fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
    method: "POST",
    headers: request_headers,
    body: JSON.stringify(request_body),
    openWhenHidden: true, //-- Keep connection open when Page Visibility API notices tab is hidden --//

    //-- ***** ***** ***** ***** ONOPEN ***** ***** ***** ***** --//
    //-- ***** ***** ***** ***** ------ ***** ***** ***** ***** --//
    async onopen(res) {
      if (res.status !== 200) {
        const errorMessage = await res.text();
        throw new ErrorForChatToast(errorMessage); //-- prompt size error and other errors --//
      }
      //-- If res.status is 200, clear the textarea --//
      else if (setPromptDraft) {
        setPromptDraft("");
      }

      //-- Conversation id --//
      const conversation_id = res.headers.get("CHRT-conversation-id");
      if (!conversation_id) {
        throw new ErrorForToast(
          "response was missing conversation_id, please try again"
        );
      }
      CC.setConversationId(conversation_id);

      //-- (new conversations only) Root node --//
      const root_node_id = res.headers.get("CHRT-root-node-id");
      const root_node_created_at = res.headers.get("CHRT-root-node-created-at");
      if (
        root_node_id &&
        root_node_id !== "none" &&
        root_node_created_at &&
        root_node_created_at !== "none"
      ) {
        new_conversation = true;
        new_conversation_id = conversation_id;
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
      new_node_id = res.headers.get("CHRT-new-node-id");
      const new_node_created_at = res.headers.get("CHRT-new-node-created-at");
      const parent_node_id = res.headers.get("CHRT-parent-node-id");
      if (!new_node_id || !new_node_created_at || !parent_node_id) {
        throw new ErrorForToast(
          "response was missing header(s), please try again"
        );
      }
      //-- Build prompt node --//
      const completion: IMessage = {
        author: CC.model.model_api_name,
        model: CC.model,
        created_at: new Date().toISOString(),
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
      nodeArray.push(new_node);
      let parent_node = nodeArray.find((node) => node._id === parent_node_id);
      if (parent_node) {
        parent_node.children_node_ids.push(new_node._id);
      }

      //-- Update rowArray --//
      let rowArray = nodeArrayToRowArray(nodeArray, new_node);
      CC.setRowArray(rowArray);

      //----//
    },
    //-- ***** ***** ***** ***** ONMESSAGE ***** ***** ***** ***** --//
    //-- ***** ***** ***** ***** --------- ***** ***** ***** ***** --//
    onmessage(event) {
      //-- Error --//
      if (event.id && event.id === "error") {
        const data = JSON.parse(event.data);
        // const message = JSON.stringify(data.message);
        throw new ErrorForToast(data.message); // DEV - test this
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
        let new_node = nodeArray.find((node) => node._id === new_node_id);
        if (new_node) {
          new_node.completion = completion_object;
        }

        //-- Overwrite completion content in rowArray --//
        CC.setRowArray((prevRowArray) => {
          return produce(prevRowArray, (draft) => {
            if (draft) {
              draft[draft.length - 1].content = completion_object.content;
            }
          });
        });
      }
      //-- API Req/Res Metadata (IAPIResMetadata)
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
        //-- Existing conversations only - update conversationsArray --//
        if (!new_conversation) {
          CC.setConversationsArray((prevArray) => {
            return produce(prevArray, (draft) => {
              if (draft) {
                draft[0].api_req_res_metadata.push(api_req_res_metadata_object);
              }
            });
          });
        }
      }
      //-- SSE completion content chunks --//
      else {
        const uriDecodedData = decodeURIComponent(event.data);

        completion_content += uriDecodedData; //-- Accumulate full completion --//

        CC.setRowArray((prevRowArray) => {
          return produce(prevRowArray, (draft) => {
            if (draft) {
              //-- If rowArray's last row's node id matches the completion's node id, update --//
              if (draft[draft.length - 1].node_id === new_node_id) {
                //-- Set accumulated completion content as content --//
                draft[draft.length - 1].content = completion_content;
                // draft[draft.length - 1].content + uriDecodedData; //-- Add message chunk to `content` of last row in rowArray --//
              }
            }
          });
        });
      }
    },
    //-- ***** ***** ***** ***** ONCLOSE ***** ***** ***** ***** --//
    onclose() {
      console.log("Connection closed by the server"); // DEV

      CC.setCompletionLoading(false);

      //-- If new conversation, create title --//
      const onCloseHandler = async () => {
        if (new_conversation) {
          //-- Navigate to new conversation id's path --//
          if (navigate) {
            navigate(`/gpt/c/${new_conversation_id}`);
          }
          //-- For new conversations, create title --//
          if (new_conversation_id) {
            await create_title(access_token, new_conversation_id);
          }
        }
        //-- Upate conversations list --//
        await list_conversations(access_token, CC, "overwrite");
      };
      onCloseHandler();
    },
    //-- ***** ***** ***** ***** ONERROR ***** ***** ***** ***** --//
    onerror(err) {
      if (err instanceof ErrorForToast || ErrorForChatToast) {
        CC.setCompletionLoading(false); //-- End completion loading --//
        throw err; //-- Rethrow error to end request --//
      } else {
        //-- Do nothing to automatically retry. Or implement retry strategy here --//
        //-- Retry Strategy: end loading state, end request --//
        CC.setCompletionLoading(false); //-- End completion loading --//
        throw err; //-- Rethrow error to end request --//
      }
    },
  });
}

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
  const new_sibling_node = nodeArray.find(
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
    const rowArray = nodeArrayToRowArray(nodeArray, new_leaf_node);
    CC.setRowArray(rowArray);
  }
}

function finalFirstborn(node: IMessageNode): IMessageNode {
  while (node.children_node_ids.length > 0) {
    let next_node_id = node.children_node_ids[0]; //-- Firstborn --//
    let next_node = nodeArray.find((node) => node._id === next_node_id);
    if (next_node) {
      node = next_node;
    }
  }
  return node;
}

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
    if (err instanceof AxiosError) {
      axiosErrorHandler(err, "Delete conversation");
    } else {
      console.log(err);
    }
  }
}

//-- Utility function(s) --//
/**
 * (6) nodeArrayToRowArray
 *
 * @param nodeArray
 * @param leafNode
 * @returns
 */
const nodeArrayToRowArray = (
  nodeArray: IMessageNode[],
  leafNode: IMessageNode
): IMessageRow[] => {
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

/**
 * (7) getNewestNode
 *
 * @param nodeArray
 * @returns
 */
const getNewestNode = (nodeArray: IMessageNode[]): IMessageNode => {
  let newestNode: IMessageNode = nodeArray[0];
  for (const node of nodeArray) {
    if (node.created_at > newestNode.created_at) {
      newestNode = node;
    }
  }

  return newestNode;
};
