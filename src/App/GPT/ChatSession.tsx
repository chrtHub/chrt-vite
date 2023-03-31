//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect, useRef, useContext, Fragment } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import { ChatContext as _ChatContext } from "./GPT";

//-- TSX Components --//
import ModelSelector from "./ModelSelector";
import * as chatson from "./chatson/chatson";

//-- NPM Components --//
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

//-- Icons --//
import { ArrowUpCircleIcon } from "@heroicons/react/20/solid";

//-- NPM Functions --//
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

//-- Utility Functions --//
import classNames from "../../Util/classNames";
import { IChatsonMessage } from "./chatson/types";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  CpuChipIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import useIsMobile from "../../Util/useIsMobile";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ChatSession() {
  //-- React Context --//
  const ChatContext = useContext(_ChatContext);

  //-- React State --//
  const [prompt, setPrompt] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //-- Recoil State --//

  //-- Auth --//
  const { getAccessTokenSilently, user } = useAuth0();

  //-- Other [] --//
  // TODO - watch the prompt length. based on the current model's limit, if the prompt is too long, warn the user

  //-- Side Effects --//

  //-- Click Handlers --//
  const submitPromptHandler = async () => {
    setPrompt("");

    //-- Refocus textarea after submitting a prompt (unless on mobile) --//
    let mobile = useIsMobile();
    if (textareaRef.current && !mobile) {
      textareaRef.current.focus();
    }

    const accessToken = await getAccessTokenSilently();

    //-- Send prompt as chat message --//
    if (user?.sub) {
      ChatContext.setLLMLoading(true);
      await chatson.send_message(
        accessToken,
        null, //-- chatson_object --//
        [user.sub],
        ChatContext.model,
        prompt,
        ChatContext.setChatson
      );
      ChatContext.setLLMLoading(false);
    }
  };

  useEffect(() => {
    console.log(ChatContext.chatson);
  }, [ChatContext.chatson]);

  //-- Message Row LHS --//
  const LHS = (props: { message: IChatsonMessage }) => {
    let { message } = props;

    //-- If author is the current user, display their profile photo --//
    if (message.author === user?.sub) {
      if (user?.picture) {
        return (
          <img
            src={user?.picture}
            alt={user?.name}
            className="h-10 w-10 rounded-full"
          />
        );
      } else {
        <div>{user.name}</div>;
      }
    }

    //-- If author is a model, display name of the model --//
    if (message.author === message.model.apiName) {
      return (
        <div className="flex flex-col items-center">
          <CpuChipIcon className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {message.model.friendlyName}
          </div>
        </div>
      );
    }

    return (
      // TODO - implement logic to show initials or perhaps photo in mulit-user chats(?)
      <div>who dis</div>
    );
  };

  //-- Message Row RHS --//
  const RHS = (props: { message: IChatsonMessage }) => {
    let { message } = props;

    let date = new Date(parseInt(message.timestamp) * 1000);
    // let friendlyDate = format(date, "hh:mm:ss");
    let friendlyDate = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);

    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {friendlyDate}
      </div>
    );
  };

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div id="chat-session-tld" className="flex max-h-full min-h-full flex-col">
      {/* CURRENT CHAT or SAMPLE PROPMTS */}
      {/* TODO - use logic below to render chat or sample propmts */}
      {true ? (
        <div
          id="llm-current-chat"
          className="flex flex-grow justify-center overflow-y-auto"
        >
          <div id="chat-rows" className="w-full list-none justify-center pl-0">
            {ChatContext.chatson?.linear_message_history
              .filter((message) => message.role !== "system")
              .map((message) => (
                <div
                  id="chat-row"
                  className={classNames(
                    message.role === "user"
                      ? "rounded-lg bg-zinc-200 dark:bg-zinc-900"
                      : "",
                    "w-full justify-center lg:flex"
                  )}
                >
                  {/* Top - hidden after 'lg' breakpoint */}
                  <div className="lg:hidden">
                    <div className="flex flex-row items-center justify-center px-4 py-2">
                      <RHS message={message} />
                      <div className="ml-auto">
                        <LHS message={message} />
                      </div>
                    </div>
                  </div>

                  {/* LHS - hidden until 'lg' breakpoint */}
                  <div
                    id="chat-lhs-content"
                    className="mt-3.5 hidden w-full flex-col items-center justify-start lg:flex lg:w-24"
                  >
                    <LHS message={message} />
                  </div>

                  {/* MESSAGE */}
                  <div className="flex w-full max-w-prose justify-center">
                    <article className="prose prose-zinc w-full max-w-prose px-4 pb-1 dark:prose-invert dark:text-white lg:px-0">
                      <li key={message.message_uuid}>
                        <ReactMarkdown
                          children={message.message}
                          remarkPlugins={[remarkGfm]}
                        />
                      </li>
                    </article>
                  </div>

                  {/* RHS - hidden until 'lg' breakpoint */}
                  <div
                    id="chat-rhs-content-lg"
                    className="mt-5 hidden w-full flex-col pr-2 lg:flex lg:w-24"
                  >
                    <div className="flex flex-row justify-end">
                      <RHS message={message} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div
          id="llm-sample-prompts"
          className="flex flex-grow flex-col items-center justify-center"
        >
          <p className="text-4xl font-medium text-zinc-500 dark:text-zinc-400">
            ChrtGPT
          </p>
          <article className="prose prose-zinc dark:prose-invert">
            <div className="">
              <p className="italic">What is ChrtGPT?</p>
              <p className="italic">How to be a good day trader?</p>
              <p className="italic">What are some risks of day trading?</p>
            </div>
          </article>
        </div>
      )}

      {/* STICKY INPUT SECTION */}
      <div className="sticky bottom-0 flex h-auto flex-col justify-center bg-zinc-50 pb-3 pt-1 dark:bg-zinc-800">
        {/* DIVIDER */}
        <div className="flex justify-center">
          {/* TODO - add a slight shadow/gradient above divider when !atBottom */}
          <div className="mb-2 w-full max-w-prose border-t-2 border-zinc-300 dark:border-zinc-600"></div>
        </div>

        {/* MODEL SELECTOR */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-prose flex-row">
            {/*  */}

            <div className="flex w-full flex-row items-center justify-end gap-4">
              {/* {ChatContext.llmLoading && (
                <>
                  <p className="dark:text-white">stop</p>
                  <XCircleIcon className="h-8 w-8 dark:text-white" />
                </>
              )} */}
            </div>

            {/*  */}
            <div className="flex w-full justify-end">
              <div className="flex flex-row items-center gap-6">
                {/* <button
                  disabled={true} // TODO - base on logic
                  onClick={() => console.log("go to top")}
                >
                  <ChevronDoubleUpIcon
                    className={classNames(
                      // TODO - add logic that knows if the chat is scrolled to top/bottom
                      // atTop
                      false
                        ? "cursor-not-allowed text-zinc-400 dark:text-zinc-500"
                        : "cursor-pointer text-zinc-900 dark:text-zinc-100",
                      "h-6 w-6"
                    )}
                  />
                </button>
                <button
                  disabled={false} // TODO - base on logic
                  onClick={() => console.log("go to bottom")}
                >
                  <ChevronDoubleDownIcon
                    className={classNames(
                      // TODO - add logic that knows if the chat is scrolled to top/bottom
                      // atBottom
                      true
                        ? "cursor-not-allowed text-zinc-400 dark:text-zinc-500"
                        : "cursor-pointer text-zinc-900 dark:text-zinc-100",
                      "h-6 w-6"
                    )}
                  />
                </button> */}
                <ModelSelector />
              </div>
            </div>
            {/*  */}
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
                placeholder="Input prompt"
                wrap="hard"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className={classNames(
                  ChatContext.llmLoading ? "bg-zinc-300 ring-2" : "",
                  "block w-full resize-none rounded-md border-0 bg-white py-1.5 pr-10 text-base text-zinc-900 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:bg-zinc-700 dark:text-white sm:leading-6"
                )}
              />

              {ChatContext.llmLoading ? (
                <button className="absolute bottom-0 right-0 flex cursor-wait items-center p-1.5 focus:outline-green-600">
                  <CpuChipIcon className="text h-6 w-6 animate-spin text-green-500" />
                </button>
              ) : (
                <button
                  id="submit-prompt-button"
                  onClick={submitPromptHandler}
                  disabled={!prompt}
                  className={classNames(
                    !prompt ? "cursor-not-allowed" : "cursor-pointer",
                    "absolute bottom-0 right-0 flex items-center p-1.5 focus:outline-green-600"
                  )}
                >
                  <ArrowUpCircleIcon
                    className={classNames(
                      prompt ? "text-green-600" : "text-zinc-300",
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
