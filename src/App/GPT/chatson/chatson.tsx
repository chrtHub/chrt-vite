//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import { produce } from "immer";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

//== Utility Functions ==//
import { getUserDbId } from "../../../Util/getUserDbId";
import { useChatContext } from "../../../Context/ChatContext";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;
import {
  IAPIReqResMetadata,
  IConversation,
  IMessageNode,
  IMessage,
  IModel,
  IChatCompletionRequestBody,
} from "./chatson_types";
import { ObjectId } from "bson";

/**
 * Causes an LLM API call after adding a propmt to a chatson object
 *
 * @param access_token (a) set as the author id, (b) sent as Bearer token in 'authorization' header
 * @param prompt_content user input to be added to the conversation
 * @returns IChatsonObject updated with the new prompt
 */
export async function send_message(
  access_token: string,
  prompt_content: string
) {
  console.log(" ----- SEND MESSAGE ----- "); // DEV

  //-- Access ChatContext --//
  let CC = useChatContext();

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

  //-- Existing conversation --//
  let parent_node_id: ObjectId | null = null;
  if (CC.nodeArray && CC.nodeMap && CC.leafNodeIdString && CC.conversation) {
    parent_node_id = CC.nodeMap[CC.leafNodeIdString].parent_node_id;
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
    await fetchEventSource(`${VITE_ALB_BASE_URL}/openai/v1/chat/completions`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(request_body),
      async onopen(res) {
        //-- Use headers to update message node --//
        let conversation_id = res.headers.get("CHRT-conversation-id");
        let new_node_id = res.headers.get("CHRT-new-node-id");
        let new_node_created_at = res.headers.get("CHRT-new-node-created-at");
        let parent_node_id = res.headers.get("CHRT-parent-node-id");

        // TODO - update message node in context
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
        //-- API Req/Res Metadata (IAPIReqResMetadata)
        else if (event.id && event.id === "api_req_res_metadata") {
          let data: IAPIReqResMetadata = JSON.parse(event.data);
          // TODO - add to conversation.api_req_res_metadata?
        }
        //-- SSE completion content chunks --//
        else {
          const uriDecodedData = decodeURIComponent(event.data);
          // TODO - update completion.content
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
