//== react, react-router-dom, recoil, Auth0 ==//
import { useState, useEffect, useRef, FocusEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useChatContext } from "../../Context/ChatContext";

//== TSX Components ==//
import ModelSelector from "./ModelSelector";
import * as chatson from "./chatson/chatson";
import ChatRow from "./ChatRow";
import ChatLanding from "./ChatLanding";
import LLMParams from "./LLMParams";
import { fourCharTokens } from "./chatson/fourCharTokens";

//== NPM Components ==//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import TextareaAutosize from "react-textarea-autosize";

//== Icons ==//
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  ChevronDoubleDownIcon,
  CpuChipIcon,
  StopIcon,
} from "@heroicons/react/24/outline";

//== NPM Functions ==//
import numeral from "numeral";

//== Utility Functions ==//
import classNames from "../../Util/classNames";
import { useIsMobile, useOSName } from "../../Util/useUserAgent";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import ConversationStats from "./ConversationStats";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ChatSession() {
  //== React State (+ Context, Refs) ==//
  let CC = useChatContext();
  let navigate = useNavigate();

  //-- Prompt stuff --//
  const [disableSubmitPrompt, setDisableSubmitPrompt] = useState<boolean>(true);
  const [promptDraft, setPromptDraft] = useState<string>("");
  const [promptTooLong, setPromptTooLong] = useState<boolean>(false);
  const [prompt3XTooLong, setPrompt3XTooLong] = useState<boolean>(false);
  const [approxTokenCount, setApproxTokenCount] = useState<number>(0);
  const [promptContent, setPromptContent] = useState<string>("");
  const [promptReadyToSend, setPromptReadyToSend] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  //-- Get conversations list on mount and if sorBy changes --//
  useEffect(() => {
    const getConversationsListHandler = async () => {
      let accessToken = await getAccessTokenSilently();
      await chatson.list_conversations(accessToken, CC, "overwrite");
    };
    getConversationsListHandler();
  }, [CC.sortBy]);

  //-- When conversation_id is updated, load that conversation --//
  let { entity_type, conversation_id } = useParams();
  useEffect(() => {
    const lambda = async () => {
      if (entity_type === "c" && conversation_id) {
        CC.setConversationId(conversation_id);
        const accessToken = await getAccessTokenSilently();
        chatson.get_conversation_and_messages(accessToken, conversation_id, CC);
      } else {
        navigate("/gpt");
      }
    };
    lambda();
  }, [conversation_id]);
  // }, [CC.conversationId, conversation_id]);

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
          try {
            await chatson.send_message(
              accessToken,
              promptContent,
              parentNodeId,
              CC
            );
          } catch (err) {
            console.log("submitPrompt error"); // DEV
            console.log(err);
            if (err instanceof Error) {
              console.log((err as Error).message);
            }
            // TODO - implement showBoundary here
          }
        }
      };
      submitPrompt();

      setPromptReadyToSend(false);
    }
  }, [promptReadyToSend]);

  //-- Submit edited prompt, create new branch --//
  const regenerateResponse = async () => {
    const accessToken = await getAccessTokenSilently();
    if (CC.rowArray) {
      let last_prompt_row = [...CC.rowArray]
        .reverse()
        .find((row) => row.prompt_or_completion === "prompt");

      if (last_prompt_row) {
        //-- Send prompt as chat message --//
        try {
          await chatson.send_message(
            accessToken,
            last_prompt_row.content,
            last_prompt_row.parent_node_id,
            CC
          );
        } catch (err) {
          console.log("(regenerate) submitPrompt error"); // DEV
          console.log(err);
          // TODO - implement showBoundary here
        }
      }
    }
  };

  //-- ***** ***** ***** ***** end of chatson ***** ***** ***** ***** --//

  //== Side Effects ==//
  //-- On promptDraft updates, update promptTooLong and disableSubmitPrompt  --//
  useEffect(() => {
    let tokens = fourCharTokens(promptDraft);

    if (!promptDraft || tokens > CC.modelTokenLimit * 3) {
      setDisableSubmitPrompt(true);
    } else {
      setDisableSubmitPrompt(false);
    }

    if (tokens > CC.modelTokenLimit) {
      setPromptTooLong(true);
    } else {
      if (promptTooLong) {
        setPromptTooLong(false);
      }
    }

    if (tokens > CC.modelTokenLimit * 3) {
      setPrompt3XTooLong(true);
    } else {
      if (prompt3XTooLong) {
        setPrompt3XTooLong(false);
      }
    }

    setApproxTokenCount(tokens);
  }, [promptDraft]);

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
      //-- prevent submit while loading or if `disableSubmitPrompt` is true --//
      if (!CC.completionLoading && !disableSubmitPrompt) {
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
  const textareaPlaceholder = () => {
    let placeholder = "Input prompt...";
    // TODO - find way to implement without onBlur
    // if (!textareaFocused && OS_NAME === "Mac OS") {
    //   placeholder = "⌘ +  /  to input prompt...";
    // }
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
                <ChatRow
                  key={`${row.node_id}-${row.role}`}
                  row={row}
                  prevRow={
                    CC.rowArray && index > 0 ? CC.rowArray[index - 1] : null
                  }
                />
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
        {/* ABOVE DIVIDER */}
        {/* Token count warning */}
        <div className="flex flex-row justify-center">
          <div
            className={classNames(
              "flex w-full max-w-prose flex-row justify-center bg-gradient-to-t",
              promptTooLong ? "from-orange-200 to-orange-50" : "",
              prompt3XTooLong ? "from-red-200 to-red-50" : ""
            )}
          >
            {/* Prompt is way too long */}
            {prompt3XTooLong && (
              <>
                <p className="py-1 text-sm font-medium italic text-red-600">
                  Prompt is way too long:{" "}
                </p>
                <p className="px-2 py-1 text-sm text-red-600">
                  ~{numeral(approxTokenCount).format("0,0")} tokens{" "}
                  <span className="text-zinc-700">
                    (Limit: {numeral(CC.modelTokenLimit).format("0,0")})
                  </span>
                </p>
              </>
            )}
            {/* Prompt may be too long */}
            {promptTooLong && !prompt3XTooLong && (
              <>
                <p className="py-1 text-sm font-medium italic text-orange-600">
                  Prompt may be too long:{" "}
                </p>
                <p className="px-2 py-1 text-sm text-orange-600">
                  ~{numeral(approxTokenCount).format("0,0")} tokens{" "}
                  <span className="text-zinc-700">
                    (Limit: {numeral(CC.modelTokenLimit).format("0,0")})
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="mb-2 w-full max-w-prose border-t-2 border-zinc-300 dark:border-zinc-600" />
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
                      {/* NOTE - Managing space here on small screens */}
                      <StopIcon className="h-5 w-5 lg:mr-2" />
                      <p className="hidden lg:flex">Stop</p>
                    </button>
                  </>
                )}
                {!CC.completionLoading &&
                  CC.rowArray &&
                  CC.rowArray.length > 0 && (
                    <button
                      onClick={() => {
                        regenerateResponse();
                      }}
                      className="flex flex-row rounded-md border-2 border-zinc-600 px-2.5 py-1 text-sm font-semibold text-zinc-600 shadow-sm hover:border-zinc-400 hover:bg-zinc-400 hover:text-zinc-50 hover:shadow-md dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-600"
                    >
                      {/* NOTE - Managing space here on small screens */}
                      <ArrowPathIcon className="h-5 w-5 lg:mr-2" />
                      <p className="hidden lg:flex">Regenerate</p>
                    </button>
                  )}
              </div>

              {/* Scroll to Bottom */}
              <button
                // disabled={!showButton}
                onClick={scrollToBottomHandler}
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
                wrap="hard"
                value={promptDraft}
                onKeyDown={keyDownHandler}
                onChange={(event) => setPromptDraft(event.target.value)}
                className={classNames(
                  "block w-full resize-none rounded-sm border-0 py-3 pr-10 text-base leading-6",
                  "text-zinc-900 placeholder:text-zinc-400",
                  "focus:ring-2 focus:ring-inset focus:ring-green-600",
                  CC.completionLoading
                    ? "animate-pulse bg-zinc-300 dark:bg-zinc-500"
                    : prompt3XTooLong
                    ? "bg-red-300 ring-red-400 focus:ring-2 focus:ring-red-400"
                    : promptTooLong
                    ? "bg-orange-300 ring-orange-400 focus:ring-2 focus:ring-orange-400"
                    : "bg-white ring-1 ring-inset ring-zinc-300 dark:bg-zinc-700 dark:text-white"
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
                  disabled={disableSubmitPrompt}
                  className={classNames(
                    disableSubmitPrompt
                      ? "cursor-not-allowed"
                      : "cursor-pointer",
                    "absolute bottom-0 right-0 flex items-center px-1.5 py-3 focus:outline-green-600"
                  )}
                >
                  <ArrowUpCircleIcon
                    className={classNames(
                      disableSubmitPrompt ? "text-zinc-400" : "text-green-600",
                      "h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>
          <div className="mb-0.5 lg:mb-1">
            {/* Smaller than large screens */}
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
              , ChrtGPT may produce false information. Use with human
              discretion.
            </p>
            {/* Large screens and up */}
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
