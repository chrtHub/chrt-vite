//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components and Functions ==//
import { list_conversations } from "./list_conversations";
import {
  ErrorForToast,
  ErrorForChatToast,
} from "../../../../Errors/ErrorClasses";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios from "axios";
import { produce } from "immer";
import { fetchEventSource } from "@microsoft/fetch-event-source";

//== Utility Functions ==//
import { getUserDbId } from "../../../../Util/getUserDbId";
import {
  nodeArrayPush,
  nodeArrayAddChildToNode,
  nodeArraySetNodeCompletion,
  nodeArrayToRowArray,
} from "./../nodeArray";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import {
  IAPIReqResMetadata,
  IConversation,
  IMessageNode,
  IMessage,
  IChatCompletionRequestBody_OpenAI,
} from "./../chatson_types";
import { IChatContext } from "../../../../Context/ChatContext";
import { NavigateFunction } from "react-router-dom";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

/**
 * @param access_token
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
  if (!CC.completionRequested) {
    CC.setCompletionRequested(true);
  }

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

  //-- Headers --//
  const request_headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  //-- Build request_body --//
  const request_body: IChatCompletionRequestBody_OpenAI = {
    prompt: prompt,
    conversation_id_string: CC.conversation?._id.toString() || null,
    parent_node_id_string: parent_node_id?.toString() || null,
    temperature: CC.temperature,
  };

  //-- Variables --//
  let new_conversation: boolean = Boolean(!CC.conversation);
  let new_conversation_id: string | null = null;
  let new_node_id: string | null;
  let completion_content: string = "";

  //-- Abort Controller signal --//
  CC.abortControllerRef.current = new AbortController();
  CC.abortControllerRef.current.signal.addEventListener("abort", () => {
    console.log("Request aborted"); // DEV
    //-- Update nodeArray, update completion loading and firstCompletionChunkReceived state --//
    let aborted_completion: IMessage = {
      author: CC.model.model_api_name,
      model: CC.model,
      created_at: new Date().toISOString(), //-- Database value will vary --//
      role: "assistant",
      content: completion_content, //-- Database value may vary --//
    };

    nodeArraySetNodeCompletion(new_node_id, aborted_completion);
    CC.setCompletionStreaming(false);
    CC.setCompletionRequested(false); //-- End completion loading --//
  });

  await fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
    method: "POST",
    headers: request_headers,
    body: JSON.stringify(request_body),
    signal: CC.abortControllerRef.current.signal,
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
        nodeArrayPush(root_node);
      }

      if (new_conversation) {
        const CURRENT_SCHEMA_VERSION = "2023-04-20";
        CC.setConversationsArray((prevArray) => {
          return produce(prevArray, (draft) => {
            draft.unshift({
              _id: conversation_id,
              api_provider_name: CC.model.api_provider_name,
              model_developer_name: CC.model.model_developer_name,
              user_db_id: user_db_id,
              title: "New conversation...",
              root_node_id: root_node_id || "",
              schema_version: CURRENT_SCHEMA_VERSION,
              created_at: root_node_created_at || "",
              last_edited: root_node_created_at || "",
              api_req_res_metadata: [],
              system_tags: [],
              user_tags: [],
            });
          });
        });
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
      nodeArrayPush(new_node);
      nodeArrayAddChildToNode(parent_node_id, new_node._id);

      //-- Update rowArray --//
      let rowArray = nodeArrayToRowArray(new_node);
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
        nodeArraySetNodeCompletion(new_node_id, completion_object);

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
              }
            }
          });
        });
        if (!CC.completionStreaming) {
          CC.setCompletionStreaming(true);
        }
      }
    },
    //-- ***** ***** ***** ***** ONCLOSE ***** ***** ***** ***** --//
    onclose() {
      CC.setCompletionStreaming(false);
      CC.setCompletionRequested(false);

      //-- If new conversation, create title --//
      const onCloseHandler = async () => {
        if (new_conversation) {
          //-- Navigate to new conversation id's path --//
          if (navigate) {
            navigate(`/gpt/c/${new_conversation_id}`);
          }
          //-- For new conversations, create title --//
          if (new_conversation_id) {
            try {
              await axios.post<string>(
                `${VITE_ALB_BASE_URL}/openai/create_title`,
                { conversation_id: new_conversation_id },
                {
                  headers: {
                    authorization: `Bearer ${access_token}`,
                  },
                }
              );
            } catch (err) {
              //----//
            }
          }
        }
        //-- Upate conversations list --//
        await list_conversations(access_token, CC, "overwrite");
      };
      onCloseHandler();
    },
    //-- ***** ***** ***** ***** ONERROR ***** ***** ***** ***** --//
    onerror(err) {
      CC.setCompletionStreaming(false);
      CC.setCompletionRequested(false); //-- End completion loading --//
      //-- Do nothing to automatically retry. Or implement retry strategy here --//
      //-- Retry Strategy: end loading state, end request --//
      if (err instanceof Error) {
        throw err; //-- Rethrow error to end request --//
      }
    },
  });
}
