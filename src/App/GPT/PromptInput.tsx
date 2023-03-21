//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
import { fooState } from "./atoms";
import { ArrowUpCircleIcon } from "@heroicons/react/20/solid";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function PromptInput() {
  //-- React State --//
  const [fooLoading, setFooLoading] = useState<boolean>(false);

  //-- Recoil State --//
  const [bar, setBar] = useRecoilState(fooState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div>
      <label htmlFor="prompt-input" className="sr-only">
        Prompt Input
      </label>

      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="text"
          name="prompt-input"
          id="prompt-input"
          className="block w-full rounded-md border-0 py-1.5 pr-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
          placeholder="Input ChrtGPT prompt"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ArrowUpCircleIcon
            className="h-5 w-5 text-zinc-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
