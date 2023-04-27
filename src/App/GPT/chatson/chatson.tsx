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
  IMessage,
  IChatCompletionRequestBody,
} from "./chatson_types";
import { IChatContext } from "../../../Context/ChatContext";
import { ObjectId } from "bson";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;
/**
 * Causes an LLM API call after adding a propmt to a chatson object
 *
 * @param access_token (a) set as the author id, (b) sent as Bearer token in 'authorization' header
 * @param prompt_content user input to be added to the conversation
 * @param node_map
 * @param CC chat context
 * @returns IChatsonObject updated with the new prompt
 */
export function send_message(
  access_token: string,
  prompt_content: string,
  node_map: Record<string, IMessageNode>,
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

  //-- Get parent_node_id if existing conversation --//
  let parent_node_id: ObjectId | null = null;
  if (
    CC.conversation &&
    Object.keys(node_map).length > 0 &&
    CC.leafNodeIdString
  ) {
    parent_node_id = node_map[CC.leafNodeIdString].parent_node_id;
  }

  //-- Build request_body --//
  let request_body: IChatCompletionRequestBody = {
    prompt: prompt,
    conversation_id: CC.conversation?._id || null,
    parent_node_id: parent_node_id, //-- Is null for new conversations --//
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

          //-- Add root node to node array --//
          CC.setNodeArray((prevNodeArray) => {
            //-- Continuing conversation --//
            if (prevNodeArray) {
              return [...prevNodeArray, root_node];
            }
            //-- New conversation --//
            else {
              return [root_node];
            }
          });
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

        //-- Build new node --//
        let new_node: IMessageNode = {
          _id: new_node_id,
          user_db_id: user_db_id,
          created_at: new_node_created_at,
          conversation_id: conversation_id,
          parent_node_id: parent_node_id,
          children_node_ids: [],
          prompt: prompt,
          completion: null,
        };

        //-- Update leaf node (do before node array update) --//
        CC.setLeafNodeIdString((prevState) => {
          return new_node._id.toString();
        });

        //-- Node array updates (do after leaf node update) --//
        CC.setNodeArray((prevNodeArray) => {
          return produce(prevNodeArray, (draft) => {
            if (draft) {
              //-- Find parent node - can't use node map here because the actual node inside the array is to be updated via immer --//
              const parentNode = draft.find((node) =>
                node._id.equals(parent_node_id)
              );
              //-- Add new node's id to children array --//
              if (parentNode) {
                parentNode.children_node_ids.push(new_node._id);
              }

              //-- Add new node --//
              draft.push(new_node);
            }
          });
        });
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
          // TODO - update completion
        }
        //-- API Req/Res Metadata (<IAPIReq></IAPIReq>ResMetadata)
        else if (event.id && event.id === "api_req_res_metadata") {
          let data: IAPIReqResMetadata = JSON.parse(event.data);
          // TODO - add to conversation.api_req_res_metadata?
        }
        //-- SSE completion content chunks --//
        else {
          const uriDecodedData = decodeURIComponent(event.data);
          // TODO - update completion.content.
          // in node array?
          // but then node array --> node map --> node rows
          // seems very expensive to do for each chunk

          // maybe only call node map to update when new node is available, not when a node's content is updated by a message chunk

          // but then also would need node rows to directly read from node array

          console.log(uriDecodedData); // DEV
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
