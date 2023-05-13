//== react, react-router-dom, recoil, Auth0 ==//
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useChatContext } from "../../Context/ChatContext";

//== TSX Components ==//
import ModelSelector from "./ModelSelector";
import * as chatson from "./chatson/chatson";
import ChatRow from "./ChatRow";
import ChatLanding from "./ChatLanding";
import LLMParams from "./LLMParams";

//== NPM Components ==//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import TextareaAutosize from "react-textarea-autosize";

//== Icons ==//
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  ArrowUpRightIcon,
  ChevronDoubleDownIcon,
  CpuChipIcon,
  StopIcon,
} from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../Util/classNames";
import { useIsMobile, useOSName } from "../../Util/useUserAgent";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import ConversationStats from "./ConversationStats";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ChatSession() {
  //== React State (+ Context, Refs) ==//
  let CC = useChatContext();

  //-- Prompt stuff --//
  const [promptDraft, setPromptDraft] = useState<string>("");
  const [promptContent, setPromptContent] = useState<string>("");
  const [promptReadyToSend, setPromptReadyToSend] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaFocus, setTextAreaFocus] = useState<boolean>(true);

  //-- Virtualized rows stuff --//
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const [atBottom, setAtBottom] = useState<boolean>(true);
  const [showButton, setShowButton] = useState<boolean>(false);

  //== Recoil State ==//

  //== Auth ==//
  const { getAccessTokenSilently, user } = useAuth0();

  //== Other ==//
  const OS_NAME = useOSName();

  //-- ***** ***** ***** ***** start of chatson ***** ***** ***** ***** --//
  //-- ChatSession calls chatson --> chatson updates CC.rowArray --> ChatSession renders CC.rowArray --//

  // TODO - update these
  //-- chatson function calls: --//
  // (1a) chatson.send_message() for first message in a new conversation
  // // use parentNodeId of null
  // // // chatsion <<TODO>>

  // (1b) chatson.send_message() to continue conversation on SAME branch
  // // use parentNodeId of current sibling
  // // // chatson appends new node to nodeArray and rowArray

  // (1c) chatson.send_message() to continue conversation on NEW branch
  // // use parentNodeId of current sibling's parent
  // // // chatson appends new node to nodeArray, pops current sibling from rowArray, appends new node to rowArray. Also, update all siblings' sibling_node_ids array.

  // (2) chatson.change_branch()
  // // current sibling node id and incrementer or 1 or -1
  // // // chatson removes current sibling and ancestor nodes from rowArray, appends new sibling, and traverses first-child ancestry, appending each row to rowArray

  // (3) chatson.reset_conversation()
  // // call reset_conversation() with <<TODO>>
  // // // chatson <<TODO>>

  //-- Get conversations list on mount and if conversationsArray changes, e.g. after delete_conversation --//
  useEffect(() => {
    const getConversationsListHandler = async () => {
      let accessToken = await getAccessTokenSilently();
      await chatson.list_conversations(accessToken, CC, "overwrite");
    };
    getConversationsListHandler();
  }, [CC.sortBy]);

  // TODO - use param to load conversation
  let { conversation_id } = useParams(); // TODO, /gpt/:conversation_id
  useEffect(() => {
    console.log("TODO - use url path param to load conversation");
  }, []);

  //-- When conversationID is updated (a) load that conversation, or (b) if null, reset conversation --//
  useEffect(() => {
    const lambda = async () => {
      if (CC.conversationId) {
        const accessToken = await getAccessTokenSilently();
        chatson.get_conversation_and_messages(accessToken, CC); //-- chatson.get_conversation_and_messages --//
      } else {
        chatson.reset_conversation(CC); //-- chatson.reset_conversation --//
      }
    };
    lambda();
  }, [CC.conversationId]);

  //-- chatson.send_message() --//
  const submitPromptHandler = () => {
    //-- Update state and trigger prompt submission to occur afterwards as a side effect --//
    setPromptContent(promptDraft);
    setPromptDraft("");
    CC.setCompletionLoading(true);
    setPromptReadyToSend(true); //-- Invokes useEffect() below --//
  };
  useEffect(() => {
    if (promptReadyToSend) {
      //-- Refocus textarea after submitting a prompt (unless on mobile) --//
      let mobile = useIsMobile();
      if (textareaRef.current && !mobile) {
        textareaRef.current.focus();
      }

      //-- If first message, parentNodeId is null --//
      let parentNodeId: string | null = null;
      //-- Else parentNodeId is current leaf node's id --//
      if (CC.rowArray && CC.rowArray.length > 0) {
        parentNodeId = CC.rowArray[CC.rowArray.length - 1].node_id;
      }

      const submitPrompt = async () => {
        const accessToken = await getAccessTokenSilently();

        //-- Send prompt as chat message --//
        if (user?.sub) {
          await chatson.send_message(
            accessToken,
            promptContent,
            parentNodeId,
            CC
          );
        }
      };
      submitPrompt();

      setPromptReadyToSend(false);
    }
  }, [promptReadyToSend]);

  //-- ***** ***** ***** ***** end of chatson ***** ***** ***** ***** --//

  //== Side Effects ==//
  //-- Listener for keyboard shortcuts --//
  useEffect(() => {
    document.addEventListener("keydown", globalKeyDownHandler);
    return () => {
      document.removeEventListener("keydown", globalKeyDownHandler);
    };
  }, []);

  //-- Virtuoso - when 'atBottom' changes - if at bottom don't show button, else show button --//
  useEffect(() => {
    if (atBottom) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  }, [atBottom, setShowButton]);

  //== Event Handlers ==//
  //-- 'Enter' to submit prompt, 'Shift + Enter' for newline --//
  const keyDownHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); //-- Prevent default behavior (newline insertion) --//
      //-- prevent submit while loading --//
      if (!CC.completionLoading) {
        submitPromptHandler();
      }
    } //-- else "Enter" with shift will just insert a newline --//
  };

  //-- Keyboard shortcut to focus prompt input textarea --//
  const globalKeyDownHandler = (event: KeyboardEvent) => {
    //-- Focus prompt input textarea (`metakey` = ⌘ on MacOS) --//
    if (OS_NAME === "Mac OS") {
      if (event.metaKey && event.key === "/") {
        event.preventDefault();
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }
    }
  };

  //-- Text area placeholder handlers and string --//
  const textareaOnFocusHandler = () => {
    setTextAreaFocus(true);
  };
  const textareaOnBlurHandler = () => {
    setTextAreaFocus(false);
  };
  const textareaPlaceholder = () => {
    let placeholder = "Input prompt...";

    if (!textAreaFocus && OS_NAME === "Mac OS") {
      placeholder = "⌘ +  /  to input prompt...";
    }

    return placeholder;
  };

  //-- Focus textarea from another component (e.g. via "New Conversation") --//
  useEffect(() => {
    if (CC.focusTextarea) {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
    CC.setFocusTextarea(false); //-- a bit janky. causes an extra render. --//
  }, [CC.focusTextarea]);

  //-- Virtuoso --//
  const scrollToBottomHandler = () => {
    if (virtuosoRef.current && CC.rowArray && CC.rowArray.length > 0) {
      virtuosoRef.current.scrollToIndex({
        index: CC.rowArray.length - 1, // e.g. visibleThread.length
        behavior: "smooth",
        align: "end",
      });
    }
  };

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div id="chat-session-tld" className="flex max-h-full min-h-full flex-col">
      {/* CURRENT CHAT or SAMPLE PROPMTS */}
      {CC.rowArray && CC.rowArray.length > 0 ? (
        <div id="llm-current-chat" className="flex flex-grow">
          <div id="chat-rows" className="w-full list-none">
            {/*-- Similar implemenatation to https://virtuoso.dev/stick-to-bottom/ --*/}
            <Virtuoso
              ref={virtuosoRef}
              data={CC.rowArray}
              itemContent={(index, row) => (
                <ChatRow key={`${row.node_id}-${row.role}`} row={row} />
              )}
              followOutput="auto"
              atBottomStateChange={(isAtBottom) => {
                setAtBottom(isAtBottom);
              }}
            />
          </div>
        </div>
      ) : (
        //-- Landing view for null conversation --//
        <ChatLanding />
      )}

      {/* STICKY INPUT SECTION */}
      <div className="sticky bottom-0 flex h-auto flex-col justify-center bg-zinc-50 pb-3 pt-1 dark:bg-zinc-950">
        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="mb-2 w-full max-w-prose border-t-2 border-zinc-300 dark:border-zinc-600"></div>
        </div>

        {/* CONTROL BAR */}
        <div className="flex flex-row justify-center">
          <div
            id="chat-session-control-bar"
            className="flex w-full max-w-prose flex-row"
          >
            <div
              id="control-bar-LHS"
              className="ml-2 flex w-0 flex-shrink-0 flex-grow flex-row items-center justify-start gap-3"
            >
              {/* Conversation stats */}
              <ConversationStats rowArrayLength={CC.rowArray?.length || 0} />
            </div>

            <div
              id="control-bar-CENTER"
              className="flex w-0 flex-shrink-0 flex-grow flex-row items-center justify-center gap-2.5"
            >
              {/* Select LLM Model */}
              <ModelSelector />
              {/* LLM param settings */}
              <LLMParams />
            </div>

            <div
              id="control-bar-RHS"
              className="mr-2 flex w-0 flex-shrink-0 flex-grow flex-row items-center justify-end gap-3"
            >
              {/* Regnerate and Stop Generation Buttons */}
              <div className="flex flex-row justify-center">
                {/* Stop Response Generation */}
                {/* DEV - always 'false' for now, when streaming in use, add logic here to allow user to stop response generation */}
                {CC.completionLoading && (
                  <>
                    <button
                      onClick={() => {
                        console.log("TODO - stop generating response");
                      }}
                      className="flex flex-row rounded-md border-2 border-zinc-600 px-2.5 py-1 text-sm font-semibold text-zinc-600 shadow-sm hover:border-zinc-400 hover:bg-zinc-400 hover:text-zinc-50 hover:shadow-md dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-600"
                    >
                      <StopIcon className="mr-2 h-5 w-5" />
                      <p>Stop</p>
                    </button>
                  </>
                )}
                {!CC.completionLoading && (
                  <button
                    onClick={() => {
                      console.log("TODO - regenerate response");
                    }}
                    className="flex flex-row rounded-md border-2 border-zinc-600 px-2.5 py-1 text-sm font-semibold text-zinc-600 shadow-sm hover:border-zinc-400 hover:bg-zinc-400 hover:text-zinc-50 hover:shadow-md dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-600"
                  >
                    <ArrowPathIcon className="mr-2 h-5 w-5" />
                    <p>Regenerate</p>
                  </button>
                )}
              </div>

              {/* Scroll to Bottom */}
              <button disabled={!showButton} onClick={scrollToBottomHandler}>
                <ChevronDoubleDownIcon
                  className={classNames(
                    showButton
                      ? "cursor-pointer text-zinc-900 dark:text-zinc-100"
                      : "cursor-not-allowed text-zinc-400 dark:text-zinc-500",
                    "h-6 w-6"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* PROMPT INPUT */}
        <div>
          <div
            id="llm-prompt-input"
            className="mb-3 flex justify-center align-bottom lg:mb-4"
          >
            <label htmlFor="prompt-input" className="sr-only">
              Prompt Input
            </label>
            <div className="relative mt-2 w-full max-w-prose rounded-md shadow-md">
              <TextareaAutosize
                autoFocus
                ref={textareaRef}
                maxRows={10}
                id="prompt-input"
                name="prompt-input"
                placeholder={textareaPlaceholder()}
                onFocus={textareaOnFocusHandler}
                onBlur={textareaOnBlurHandler}
                wrap="hard"
                value={promptDraft}
                onKeyDown={keyDownHandler}
                onChange={(event) => setPromptDraft(event.target.value)}
                className={classNames(
                  CC.completionLoading
                    ? "animate-pulse bg-zinc-300 ring-2 dark:bg-zinc-500"
                    : "dark:bg-zinc-700",
                  "block w-full resize-none rounded-sm border-0 bg-white py-3 pr-10 text-base text-zinc-900 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:text-white sm:leading-6"
                )}
              />

              {CC.completionLoading ? (
                <button className="absolute bottom-0 right-0 flex cursor-wait items-center px-1.5 py-3 focus:outline-green-600">
                  <CpuChipIcon className="text h-6 w-6 animate-spin text-green-500" />
                </button>
              ) : (
                <button
                  id="submit-prompt-button"
                  onClick={submitPromptHandler}
                  disabled={!promptDraft}
                  className={classNames(
                    !promptDraft ? "cursor-not-allowed" : "cursor-pointer",
                    "absolute bottom-0 right-0 flex items-center px-1.5 py-3 focus:outline-green-600"
                  )}
                >
                  <ArrowUpCircleIcon
                    className={classNames(
                      promptDraft ? "text-green-600" : "text-zinc-300",
                      "h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>
          <div className="mb-0.5 lg:mb-1">
            <p className="flex-row justify-center text-center font-sans text-xs italic text-zinc-500 dark:text-zinc-400 lg:hidden">
              Due to the&nbsp;
              <span className="inline-block">
                <a
                  className="underline"
                  href="https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/"
                  target="_blank"
                >
                  nature of LLMs
                </a>
              </span>
              , ChrtGPT may produce false information.
              <br />
              Use with human discretion.
            </p>
            <p className="hidden flex-row justify-center text-center font-sans text-xs italic text-zinc-500 dark:text-zinc-400 lg:flex">
              Due to the&nbsp;
              <span className="inline-block">
                <a
                  className="underline"
                  href="https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/"
                  target="_blank"
                >
                  nature of LLMs
                </a>
              </span>
              , ChrtGPT may produce false information.&nbsp;
              {/* <br /> */}
              Use with human discretion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
