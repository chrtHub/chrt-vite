//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import ModelListbox from "./ModelListbox";
import ChatSession from "./ChatSession";
import PromptInput from "./PromptInput";
import ChatHistory from "./ChatHistory";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
import { fooState } from "./atoms";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function GPT() {
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
    <>
      <div id="gpt-grid-div" className="grid h-full grid-cols-12 gap-2">
        <div
          id="gpt-chat-current"
          className="col-span-9 h-full overflow-y-auto"
        >
          <ModelListbox />
          <ChatSession />
          <PromptInput />
        </div>

        <div
          id="gpt-chat-history"
          className="col-span-3 h-full overflow-y-auto"
        >
          {/* hidden until large? hidden lg:??? */}
          <ChatHistory />
        </div>
      </div>
    </>
  );
}
