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
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;
import { chatResponseState } from "./atoms";

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ChatSession() {
  //-- React State --//
  const [fooLoading, setFooLoading] = useState<boolean>(false);

  //-- Recoil State --//
  const [chatResponse, setChatResponse] = useRecoilState(chatResponseState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex justify-center">
      <ul role="list" className="divide-y divide-zinc-200">
        <article className="prose prose-zinc">
          <li>
            <p>{chatResponse.response}</p>
          </li>
        </article>
      </ul>
    </div>
  );
}
