//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect, useRef, useContext } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import { ChatContext as _ChatContext } from "./GPT";

//-- TSX Components --//
import ModelListbox from "./ModelListbox";
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

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex min-h-full flex-col">
      {/* MODEL LISTBOX */}
      <div id="llm-model-listbox" className="flex justify-center">
        <ModelListbox />
      </div>

      {/* CURRENT CHAT or SAMPLE PROPMTS */}
      {true ? (
        <div id="llm-current-chat" className="flex flex-grow justify-center">
          <ul role="list" className="divide-y divide-zinc-200">
            <article className="prose prose-zinc dark:prose-invert">
              {/* from Context API */}
              <li>
                {ChatContext.chatson?.linear_message_history.map((message) => (
                  <li>
                    <p>user: {message.user}</p>
                    <p>model: {message.model}</p>
                    <p>message: {message.message}</p>
                    ---
                  </li>
                ))}
              </li>
              {/*  */}
            </article>
          </ul>
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

      {/* PROMPT INPUT */}
      <div id="llm-prompt-input" className="flex justify-center pt-3 pb-6">
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
              "absolute right-0 bottom-0 flex items-center p-2 focus:outline-green-600"
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
  );
}
