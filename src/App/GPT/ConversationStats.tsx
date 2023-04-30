//-- react, react-router-dom, recoil, Auth0 --//
import { useChatContext } from "../../Context/ChatContext";
import { Fragment, useState, useEffect } from "react";

//-- TSX Components --//

//-- NPM Components --//
import { Menu, Transition } from "@headlessui/react";

//-- Icons --//
import { CircleStackIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../Util/classNames";
import { format, parseISO } from "date-fns";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

export default function ConversationStats(props: { rowArrayLength: number }) {
  let { rowArrayLength } = props;

  //-- React State --//
  const [conversationTotalTokens, setConversationTotalTokens] =
    useState<number>(0);
  const CC = useChatContext();

  //-- Recoil State --//
  //-- Auth --//
  //-- Other [] --//

  let formattedDate: string;
  let created_at = CC.conversation?.created_at; // 2023-04-30T19:35:13.561Z
  if (created_at) {
    created_at = parseISO(`${created_at}`);
    formattedDate = format(created_at, "MMM dd, yyyy @ hh:mm:ss aaa");
  } else {
    formattedDate = "n/a";
  }

  //-- Side Effects --//
  let total_tokens: number = 0;
  useEffect(() => {
    let tokenCount: number = 0;
    CC.conversation?.api_req_res_metadata.forEach((x) => {
      tokenCount += x.total_tokens;
    });
    setConversationTotalTokens(tokenCount);
  }, [CC.conversation?.api_req_res_metadata]);

  //-- Click Handlers --//
  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="mx-2 flex items-center rounded-full align-middle text-zinc-600 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-100">
          <span className="sr-only">LLM params settings</span>
          <CircleStackIcon className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bottom-full left-0 z-10 mb-3 ml-1 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Tokens used: {conversationTotalTokens}
                </p>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  API Request Count:{" "}
                  {CC.conversation?.api_req_res_metadata.length || 0}
                </p>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Messages count: {rowArrayLength}
                </p>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Created at: {formattedDate}
                </p>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
