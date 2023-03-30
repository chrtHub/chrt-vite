//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect, useRef, useContext } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import { ChatContext as _ChatContext } from "./GPT";

//-- TSX Components --//
import ModelSelector from "./ModelSelector";
import * as chatson from "./chatson/chatson";

//-- NPM Components --//
import TextareaAutosize from "react-textarea-autosize";

//-- Icons --//
import { ArrowUpCircleIcon } from "@heroicons/react/20/solid";

//-- NPM Functions --//
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

//-- Utility Functions --//
import classNames from "../../Util/classNames";
import { IChatsonMessage } from "./chatson/types";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

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
    const accessToken = await getAccessTokenSilently();
    // TODO - implement ability to add message to existing chatson object

    //-- Send prompt as chat message --//
    if (user?.sub) {
      // setLLMLoading to true here??
      await chatson.send_message(
        accessToken,
        null, //-- chatson_object --//
        [user.sub],
        ChatContext.model,
        prompt,
        ChatContext.setChatson,
        ChatContext.setLLMLoading
      );
      // setLLMLoading to false here??
    }
    setPrompt("");

    //-- Refocus textarea after submitting a prompt --//
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    console.log(ChatContext.chatson);
  }, [ChatContext.chatson]);

  const LHS = (props: { message: IChatsonMessage }) => {
    let { message } = props;

    //-- If author is the current user, display their profile photo --//
    if (message.author === user?.sub) {
      if (user?.picture) {
        return (
          <img
            src={user?.picture}
            alt={user?.name}
            className="h-24 w-24 rounded-full"
          />
        );
      } else {
        <div>{user.name}</div>;
      }
    }

    //-- If author is a model, display name of the model --//
    if (message.author === message.model.apiName) {
      return <div>{message.model.friendlyName}</div>;
    }

    return (
      // TODO - implement logic to show initials or perhaps photo in mulit-user chats(?)
      <div>who dis</div>
    );
  };

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    // <div className="flex max-h-full flex-col">
    <div id="chat-session-tld" className="flex max-h-full min-h-full flex-col">
      {/* CURRENT CHAT or SAMPLE PROPMTS */}
      {true ? (
        <div
          id="llm-current-chat"
          className="flex flex-grow justify-center overflow-y-auto"
        >
          <div className="w-full list-none divide-y divide-gray-200 pl-0">
            {ChatContext.chatson?.linear_message_history
              .filter((message) => message.role !== "system")
              .map((message) => (
                <div id="chat-row" className="justify-center lg:flex">
                  <div
                    id="chat-lhs-content"
                    className="w-full bg-red-100 lg:w-24"
                  >
                    <LHS message={message} />
                  </div>
                  <article className="prose prose-zinc w-full max-w-prose dark:prose-invert">
                    <li key={message.message_uuid} className="sm:px-0">
                      <p>role: {message.role}</p>
                      <p className="">{message.message}</p>
                    </li>
                  </article>
                  <div
                    id="chat-rhs-content"
                    className="w-full bg-orange-100 lg:w-24"
                  >
                    {message.timestamp}
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
      <div className="sticky bottom-0 flex h-28 flex-col justify-center bg-zinc-50 pb-3 pt-1">
        {/* MODEL SELECTOR */}
        <div className="flex justify-center">
          <div
            id="llm-model-selector"
            className="flex w-full max-w-prose justify-end"
          >
            <ModelSelector />
          </div>
        </div>

        {/* PROMPT INPUT */}
        <div>
          <div
            id="llm-prompt-input"
            className="flex justify-center align-bottom"
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
                  ChatContext.llmLoading
                    ? "animate-pulse ring-2 ring-indigo-500"
                    : "",
                  "block w-full resize-none rounded-md border-0 py-1.5 pr-10 text-base text-zinc-900 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:leading-6"
                )}
              />

              <button
                id="submit-prompt-button"
                onClick={submitPromptHandler}
                disabled={ChatContext.llmLoading || !prompt ? true : false}
                className={classNames(
                  !prompt || ChatContext.llmLoading
                    ? "cursor-not-allowed"
                    : "cursor-pointer",
                  "absolute bottom-0 right-0 flex items-center p-2 focus:outline-green-600"
                )}
              >
                <ArrowUpCircleIcon
                  className={classNames(
                    prompt ? "text-green-600" : "text-zinc-300",
                    ChatContext.llmLoading
                      ? "texgt- animate-spin text-indigo-500"
                      : "",
                    "h-5 w-5"
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
