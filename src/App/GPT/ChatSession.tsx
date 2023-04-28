//== react, react-router-dom, recoil, Auth0 ==//
import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useChatContext } from "../../Context/ChatContext";

//== TSX Components ==//
import ModelSelector from "./ModelSelector";
import * as chatson from "./chatson/chatson";
import ChatRow from "./ChatRow";
import ChatLanding from "./ChatLanding";

//== NPM Components ==//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import TextareaAutosize from "react-textarea-autosize";

//== Icons ==//
import { ArrowUpCircleIcon } from "@heroicons/react/20/solid";
import {
  ChevronDoubleDownIcon,
  CpuChipIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../Util/classNames";
import { useIsMobile, useOSName } from "../../Util/useUserAgent";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ChatSession() {
  //== React State (+ Context, Refs) ==//
  let CC = useChatContext();

  //-- Prompt stuff --//
  const [promptInput, setPromptInput] = useState<string>("");
  const [promptToSend, setPromptToSend] = useState<string>("");
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

  // TODO - implement:
  // parentNode
  // // if new conversation, parent_node is null
  // // if new branch, parent of current leaf node
  // // if same branch, current leaf node
  // chatson.reset_conversation()
  // chatson.change_branch()

  //== Side Effects ==//
  //-- Submit prompt from textarea --//
  const submitPromptHandler = () => {
    //-- Update state and trigger prompt submission to occur afterwards as a side effect --//
    setPromptToSend(promptInput);
    setPromptInput("");
    CC.setCompletionLoading(true);
    setPromptReadyToSend(true);
  };
  //-- Prompt status checker and submitter --//
  useEffect(() => {
    if (promptReadyToSend) {
      //-- Refocus textarea after submitting a prompt (unless on mobile) --//
      let mobile = useIsMobile();
      if (textareaRef.current && !mobile) {
        textareaRef.current.focus();
      }

      const submitPrompt = async () => {
        const accessToken = await getAccessTokenSilently();

        //-- Send prompt as chat message --//
        if (user?.sub) {
          await chatson.send_message(accessToken, promptToSend, parentNode, CC);
          CC.setCompletionLoading(false);
        }
      };
      submitPrompt();

      setPromptReadyToSend(false);
    }
  }, [promptReadyToSend]);

  //-- Listener for keyboard shortcuts --//
  useEffect(() => {
    document.addEventListener("keydown", globalKeyDownHandler);
    return () => {
      document.removeEventListener("keydown", globalKeyDownHandler);
    };
  }, []);

  //-- Virtuosos - when 'atBottom' changes - if at bottom don't show button, else show button --//
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
      submitPromptHandler();
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
  const textareaFocusHandler = () => {
    setTextAreaFocus(true);
  };
  const textareaBlurHandler = () => {
    setTextAreaFocus(false);
  };
  const textareaPlaceholder = () => {
    let placeholder = "Input prompt...";

    if (!textAreaFocus && OS_NAME === "Mac OS") {
      placeholder = "⌘ +  /  to input prompt...";
    }

    return placeholder;
  };

  //-- Virtuoso --//
  // const scrollToBottomHandler = () => {
  //   // visibleThread.length > 0
  //   if (virtuosoRef.current && filteredMessages.length > 0) {
  //     virtuosoRef.current.scrollToIndex({
  //       index: filteredMessages.length - 1, // visibleThread.length
  //       behavior: "smooth",
  //       align: "end",
  //     });
  //   }
  // };

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
              followOutput="smooth"
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
      <div className="sticky bottom-0 flex h-auto flex-col justify-center bg-zinc-50 pb-3 pt-1 dark:bg-zinc-800">
        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="mb-2 w-full max-w-prose border-t-2 border-zinc-300 dark:border-zinc-600"></div>
        </div>

        {/* CONTROL BAR */}
        <div className="flex justify-center">
          <div
            id="chat-session-control-bar"
            className="flex w-full max-w-prose flex-row"
          >
            {/* Stop Response Generation */}
            <div className="flex w-full flex-row items-center justify-center">
              {/* DEV - always 'false' for now, when streaming in use, add logic here to allow user to stop response generation */}
              {false && CC.completionLoading && (
                <>
                  <button
                    onClick={() => console.log("cancel")} // TODO - add logic
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-zinc-600 px-2.5 py-1.5 font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                  >
                    <XCircleIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    <p className="text-sm">Cancel</p>
                  </button>
                </>
              )}
            </div>

            {/* Select LLM Model */}
            <div className="flex w-full items-center justify-center">
              <ModelSelector />
            </div>

            {/* Scroll to Bottom */}
            <div className="flex w-full items-center justify-end">
              <button
                className="pr-1.5"
                disabled={!showButton}
                // onClick={scrollToBottomHandler}
              >
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
            className="mb-2 flex justify-center align-bottom lg:mb-4"
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
                onFocus={textareaFocusHandler}
                onBlur={textareaBlurHandler}
                wrap="hard"
                value={promptInput}
                onKeyDown={keyDownHandler}
                onChange={(event) => setPromptInput(event.target.value)}
                className={classNames(
                  CC.completionLoading ? "bg-zinc-300 ring-2" : "",
                  "block w-full resize-none rounded-md border-0 bg-white py-1.5 pr-10 text-base text-zinc-900 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:bg-zinc-700 dark:text-white sm:leading-6"
                )}
              />

              {CC.completionLoading ? (
                <button className="absolute bottom-0 right-0 flex cursor-wait items-center p-1.5 focus:outline-green-600">
                  <CpuChipIcon className="text h-6 w-6 animate-spin text-green-500" />
                </button>
              ) : (
                <button
                  id="submit-prompt-button"
                  onClick={submitPromptHandler}
                  disabled={!promptInput}
                  className={classNames(
                    !promptInput ? "cursor-not-allowed" : "cursor-pointer",
                    "absolute bottom-0 right-0 flex items-center p-1.5 focus:outline-green-600"
                  )}
                >
                  <ArrowUpCircleIcon
                    className={classNames(
                      promptInput ? "text-green-600" : "text-zinc-300",
                      "h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
