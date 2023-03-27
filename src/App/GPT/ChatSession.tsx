//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import ModelListbox from "./ModelListbox";

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
import { chatResponseState } from "./atoms";

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ChatSession() {
  //-- React State --//
  const [prompt, setPrompt] = useState<string>("");
  const [llmLoading, setLLMLoading] = useState<boolean>(false);

  //-- Recoil State --//
  const [chatResponse, setChatResponse] = useRecoilState(chatResponseState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [] --//
  // TODO - watch the prompt length. based on the current model's limit, if the prompt is too long, warn the user

  //-- Side Effects --//

  //-- Click Handlers --//
  const submitPromptHandler = async () => {
    console.log(prompt); // DEV

    setLLMLoading(true);
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      // DEV - to add logic here for using jaison object

      //-- Make POST request --//
      let res = await axios.post(
        `${VITE_ALB_BASE_URL}/llm/gpt-3.5-turbo`,
        //-- Body Content --//
        {
          prompt: prompt,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setChatResponse({ response: res.data.choices[0].message.content }); // DEV
      console.log(res.data.choices[0].message.content); // DEV
      //----//
    } catch (err) {
      console.log(err);
    }
    setLLMLoading(false);
  };

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex-column justify-center">
      {/* MODEL LISTBOX */}
      <div id="llm-model-listbox" className="flex justify-center">
        <ModelListbox />
      </div>

      {/* CHAT MESSAGES */}
      <div id="llm-current-chat" className="flex justify-center">
        <ul role="list" className="divide-y divide-zinc-200">
          <article className="prose prose-zinc">
            <li>
              <p>{chatResponse.response}</p>
            </li>
          </article>
        </ul>
      </div>

      {/* PROMPT INPUT */}
      <div id="llm-prompt-input" className="flex justify-center">
        <label htmlFor="prompt-input" className="sr-only">
          Prompt Input
        </label>
        <div className="relative mt-2 w-full max-w-prose rounded-md shadow-sm">
          <TextareaAutosize
            maxRows={10}
            id="prompt-input"
            name="prompt-input"
            placeholder="Input prompt"
            wrap="hard"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className={classNames(
              llmLoading ? "animate-pulse ring-2 ring-indigo-500" : "",
              "focs:ring-inset block w-full resize-none rounded-md border-0 py-1.5 pr-10 text-zinc-900 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6"
            )}
          />

          <button
            id="submit-prompt-button"
            onClick={submitPromptHandler}
            disabled={llmLoading || !prompt ? true : false}
            className={classNames(
              !prompt || llmLoading ? "cursor-not-allowed" : "cursor-pointer",
              "absolute right-0 bottom-0 flex items-center p-2 focus:outline-green-600"
            )}
          >
            <ArrowUpCircleIcon
              className={classNames(
                prompt ? "text-green-600" : "text-zinc-300",
                llmLoading ? "texgt- animate-spin text-indigo-500" : "",
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
