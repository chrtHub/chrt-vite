//== react, react-router-dom, Auth0 ==//
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useChatContext } from "../../Context/ChatContext";
import { ErrorBoundary } from "react-error-boundary";

//== TSX Components and Functions ==//
import { send_message } from "./chatson/Functions/send_message";
import { get_conversation_and_messages } from "./chatson/Functions/get_conversation_and_messages";
import ModelSelector from "./ModelSelector";
import LLMParams from "./LLMParams";
import { countTokens } from "./chatson/Util/countTokens";
import ChatRowArea from "./ChatRowArea";
import { ChatRowAreaFallback } from "./ChatRowAreaFallback";

//== NPM Components ==//
import { VirtuosoHandle } from "react-virtuoso";
import TextareaAutosize from "react-textarea-autosize";

//== Icons ==//
import {
  ArrowUpCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  ChevronDoubleDownIcon,
  CpuChipIcon,
  StopIcon,
} from "@heroicons/react/24/outline";

//== NPM Functions ==//
import numeral from "numeral";
import { toast } from "react-toastify";

//== Utility Functions ==//
import classNames from "../../Util/classNames";
import { useIsMobile, useOSName } from "../../Util/useUserAgent";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import ConversationStats from "./ConversationStats";
import "../../Components/ProgressBar.css";
import { ErrorForToast, ErrorForChatToast } from "../../Errors/ErrorClasses";
import { AxiosError } from "axios";
import { axiosErrorToaster } from "../../Errors/axiosErrorToaster";
import { ObjectId } from "bson";
import { DARK_THEME_BG, LIGHT_THEME_BG } from "../../Layout/Theme";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ChatSession() {
  //== React State (+ Context, Refs) ==//
  let CC = useChatContext();
  let navigate = useNavigate();

  //-- Prompt Stuff --//
  const [disableSubmitPrompt, setDisableSubmitPrompt] = useState<boolean>(true);
  const [promptDraft, setPromptDraft] = useState<string>("");
  const [promptTooLong, setPromptTooLong] = useState<boolean>(false);
  const [prompt2XTooLong, setPrompt2XTooLong] = useState<boolean>(false);
  const [approxTokenCount, setApproxTokenCount] = useState<number>(0);
  const [promptContent, setPromptContent] = useState<string>("");
  const [promptReadyToSend, setPromptReadyToSend] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [showError, setShowError] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState<number>(0);
  let errorTimeoutRef = useRef<number | null>(null);

  //-- Virtualized rows stuff --//
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const [atBottom, setAtBottom] = useState<boolean>(true);
  const [showButton, setShowButton] = useState<boolean>(false);

  //== Auth ==//
  const { getAccessTokenSilently, user } = useAuth0();

  //== Other ==//
  const OS_NAME = useOSName();

  //-- ***** ***** ***** ***** start of chatson ***** ***** ***** ***** --//
  //-- When conversation_id is updated (via param or CC.setConversationId), load that conversation --//
  let { entity_type, conversation_id } = useParams();
  useEffect(() => {
    //-- If SSE abortable, abort --//
    if (CC.completionStreaming) {
      if (CC.abortControllerRef.current) {
        CC.abortControllerRef.current.abort();
      }
    }

    const lambda = async () => {
      if (
        entity_type === "c" &&
        conversation_id &&
        ObjectId.isValid(conversation_id)
      ) {
        CC.setConversationId(conversation_id);
        const accessToken = await getAccessTokenSilently();
        try {
          await get_conversation_and_messages(accessToken, conversation_id, CC);
        } catch (err) {
          if (err instanceof AxiosError) {
            axiosErrorToaster(err, "Get Conversation");
          } else if (err instanceof Error) {
            toast(err.message);
          }
        }
      }
    };
    lambda();
  }, [conversation_id]);

  //-- send_message() --//
  const submitPromptHandler = () => {
    //-- Update state and trigger prompt submission to occur afterwards as a side effect --//
    setPromptContent(promptDraft);
    CC.setCompletionRequested(true);
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
            await send_message(
              accessToken,
              promptContent,
              parentNodeId,
              CC,
              setPromptDraft,
              navigate
            );
          } catch (err) {
            if (err instanceof ErrorForChatToast) {
              chatToast(err.message);
            } else if (err instanceof ErrorForToast) {
              toast(err.message);
            } else if (err instanceof Error) {
              toast(err.message);
            }
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
        CC.setCompletionRequested(true);
        try {
          await send_message(
            accessToken,
            last_prompt_row.content,
            last_prompt_row.parent_node_id,
            CC
          );
        } catch (err) {
          if (err instanceof ErrorForChatToast) {
            chatToast(err.message);
          } else if (err instanceof ErrorForToast) {
            toast(err.message);
          } else if (err instanceof Error) {
            toast(err.message);
          }
        }
      }
    }
  };
  //-- ***** ***** ***** ***** end of chatson ***** ***** ***** ***** --//

  //-- Chat Toast --//
  const chatToast = (message: string) => {
    //-- Show error --//
    setShowError(message);
    //-- Clear old timeout --//
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    //-- Set new timeout --//
    errorTimeoutRef.current = setTimeout(() => {
      setShowError(null);
    }, 4000);
    //-- Cause error alert progress bar animation to restart --//
    setAnimationKey((prevKey) => prevKey + 1);
  };

  //== Side Effects ==//
  //-- On promptDraft updates, update promptTooLong and disableSubmitPrompt  --//
  useEffect(() => {
    let tokens = countTokens(promptDraft);

    if (!promptDraft || tokens > CC.modelTokenLimit * 2) {
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

    if (tokens > CC.modelTokenLimit * 2) {
      setPrompt2XTooLong(true);
    } else {
      if (prompt2XTooLong) {
        setPrompt2XTooLong(false);
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
      if (!CC.completionRequested && !disableSubmitPrompt) {
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
      {/* CURRENT CHAT, SAMPLE PROPMTS, OR FALLBACK */}
      <ErrorBoundary FallbackComponent={ChatRowAreaFallback}>
        <ChatRowArea
          virtuosoRef={virtuosoRef}
          setAtBottom={setAtBottom}
          chatToast={chatToast}
        />
      </ErrorBoundary>

      {/* STICKY INPUT SECTION */}
      <div
        className={classNames(
          `${LIGHT_THEME_BG} ${DARK_THEME_BG}`,
          "sticky bottom-0 flex h-auto flex-col justify-center pb-3 pt-1"
        )}
      >
        {/* ABOVE DIVIDER */}

        {/* Error Alert */}
        <div className="flex flex-row justify-center">
          {showError && (
            <div className="mb-1 w-full max-w-prose rounded-md bg-rose-100 dark:bg-rose-800">
              {/* Content */}
              <div className="flex flex-row justify-between px-2 pb-1 pt-2">
                <div>
                  <ExclamationTriangleIcon
                    className="h-5 w-5 text-rose-500 dark:text-rose-100"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-rose-800 dark:text-rose-100">
                    {showError}
                  </p>
                </div>
                <div className="pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowError(null);
                      }}
                      className="inline-flex rounded-full p-1.5 text-rose-500 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 focus:ring-offset-rose-50 dark:text-rose-100 dark:hover:bg-rose-950"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="h-1.5 w-full rounded-b bg-rose-100 dark:bg-rose-900">
                <div
                  key={animationKey}
                  className="h-full w-full rounded-b bg-rose-500 dark:bg-rose-200"
                  style={{ animation: "progress 4s linear" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Token count warning */}
        <div className="flex flex-row justify-center">
          <div
            className={classNames(
              "mb-1 flex w-full max-w-prose flex-row justify-center rounded-full text-white",
              promptTooLong && !prompt2XTooLong
                ? "bg-orange-500  dark:bg-orange-800"
                : prompt2XTooLong
                ? "bg-rose-500  dark:bg-rose-800"
                : ""
            )}
          >
            {/* Prompt may be too long */}
            {promptTooLong && !prompt2XTooLong && (
              <>
                <p className="py-1 text-sm italic">Prompt may be too long: </p>
                <p className="px-2 py-1 text-sm font-medium">
                  ~{numeral(approxTokenCount).format("0,0")} tokens{" "}
                  <span className="">
                    (Limit: {numeral(CC.modelTokenLimit).format("0,0")})
                  </span>
                </p>
              </>
            )}
            {/* Prompt is way too long */}
            {prompt2XTooLong && (
              <>
                <p className="py-1 text-sm italic">Prompt is way too long: </p>
                <p className="px-2 py-1 text-sm font-medium">
                  ~{numeral(approxTokenCount).format("0,0")} tokens{" "}
                  <span className="">
                    (Limit: {numeral(CC.modelTokenLimit).format("0,0")})
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="mb-2 w-full max-w-prose rounded-full border-t-2 border-zinc-300 dark:border-zinc-600" />
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
                {CC.completionStreaming && (
                  <>
                    <button
                      onClick={() => {
                        if (CC.abortControllerRef.current) {
                          CC.abortControllerRef.current.abort();
                        }
                      }}
                      className="flex flex-row rounded-md border-2 border-zinc-600 px-2.5 py-1 text-sm font-semibold text-zinc-600 shadow-sm hover:border-zinc-400 hover:bg-zinc-400 hover:text-zinc-50 hover:shadow-md dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-600"
                    >
                      {/* NOTE - Managing space here on small screens */}
                      <StopIcon className="h-5 w-5 lg:mr-2" />
                      <p className="hidden lg:flex">Stop</p>
                    </button>
                  </>
                )}
                {!CC.completionRequested &&
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
            className="mb-5 flex justify-center align-bottom lg:mb-4"
          >
            <label htmlFor="prompt-input" className="sr-only">
              Prompt Input
            </label>
            <div className="relative mt-2 w-full max-w-prose rounded-lg shadow-md">
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
                  "block w-full resize-none rounded-lg border-0 py-3 pr-10 text-base leading-6",
                  "text-zinc-900 placeholder:text-zinc-400",
                  "focus:ring-2 focus:ring-inset focus:ring-green-600",
                  CC.completionRequested
                    ? "animate-pulse bg-zinc-300 dark:bg-zinc-500"
                    : promptTooLong && !prompt2XTooLong
                    ? "bg-orange-300 ring-1 ring-orange-400 focus:ring-2 focus:ring-orange-400 dark:ring-orange-600 dark:focus:ring-orange-600"
                    : prompt2XTooLong
                    ? "bg-rose-300 ring-1 ring-rose-400 focus:ring-2 focus:ring-rose-400 dark:ring-rose-600 dark:focus:ring-rose-600"
                    : "bg-white ring-1 ring-inset ring-zinc-300 dark:bg-zinc-700 dark:text-white"
                )}
              />
              {CC.completionRequested ? (
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
          <div className="mb-0.5 pl-14 pr-2 lg:mb-1">
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
