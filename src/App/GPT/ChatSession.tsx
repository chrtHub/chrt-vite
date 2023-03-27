//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import ModelListbox from "./ModelListbox";

//-- NPM Components --//

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
  const [rows, setRows] = useState(3); // DEV - to be 1
  const [prompt, setPrompt] = useState<string>("");
  const [llmLoading, setLLMLoading] = useState<boolean>(false);

  //-- Recoil State --//
  const [chatResponse, setChatResponse] = useRecoilState(chatResponseState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//
  const submitPromptHandler = async () => {
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
      <div id="llm-old-prompt-input" className="flex justify-center">
        <label htmlFor="prompt-input" className="sr-only">
          Prompt Input
        </label>
        <div className="relative mt-2 w-full max-w-prose rounded-md shadow-sm">
          <textarea
            rows={rows}
            name="prompt-input"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            id="prompt-input"
            className={classNames(
              llmLoading ? "animate-pulse ring-2 ring-blue-500" : "",
              "focs:ring-inset block w-full resize-none rounded-md border-0 py-1.5 pr-10 text-zinc-900 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6"
            )}
            placeholder="Input prompt"
            defaultValue={""}
          />

          <button
            onClick={submitPromptHandler}
            disabled={llmLoading || !prompt ? true : false}
            className={classNames(
              prompt ? "cursor-pointer" : "cursor-not-allowed",
              "absolute inset-y-0 right-0 flex  items-center pr-3"
            )}
          >
            <ArrowUpCircleIcon
              className={classNames(
                prompt ? "text-green-600" : "text-zinc-300",
                llmLoading ? "animate-spin text-blue-500" : "",
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
