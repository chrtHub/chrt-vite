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
// import classNames

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
import { fooState } from "./atoms";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import { data } from "./foo"; // DEV
import logo from "../../Assets/chrt-logo/2023-02-04-chrt-logo-310-310.png";

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ChatHistory() {
  //-- React State --//
  const [fooLoading, setFooLoading] = useState<boolean>(false);

  //-- Recoil State --//
  const [bar, setBar] = useRecoilState(fooState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //   "2023-03-19": [
  //     {
  //       uuid: "ghi789",
  //       description: "Entry for March 19th",
  //       promptCount: 1,
  //       sizeKB: 16,
  //     },

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <nav className="h-full overflow-y-auto" aria-label="Directory">
      {Object.keys(data).map((date) => (
        <div key={date} className="relative">
          <div className="sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
            <h3>{date}</h3>
          </div>
          <ul role="list" className="relative -z-10 divide-y divide-gray-200">
            {data[date]
              .filter((chat) => chat.date === date)
              .map((chat) => (
                <li key={chat.uuid} className="bg-white">
                  <div className="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={logo}
                        alt="logo"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <a href="#" className="focus:outline-none">
                        {/* Extend touch target to entire panel */}
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">
                          {chat.description}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {chat.sizeKB}
                        </p>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
