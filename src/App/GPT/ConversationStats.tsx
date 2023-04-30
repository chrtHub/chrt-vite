//-- react, react-router-dom, recoil, Auth0 --//
import { useChatContext } from "../../Context/ChatContext";
import { Fragment, useState, useEffect } from "react";

//-- TSX Components --//

//-- NPM Components --//
import { Popover, Transition } from "@headlessui/react";

//-- Icons --//
import {
  ChatBubbleBottomCenterTextIcon,
  CircleStackIcon,
  ClockIcon,
  CodeBracketSquareIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

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
  const created_at = CC.conversation?.created_at;
  const formattedDate: string = created_at
    ? format(new Date(created_at), "MMM dd, yyyy")
    : "n/a";
  const formattedTime: string = created_at
    ? format(new Date(created_at), "hh:mm:ss aaa")
    : "";

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
    <Popover as="div" className="relative inline-block text-left">
      <div>
        <Popover.Button className="mx-2 flex items-center rounded-full align-middle text-zinc-600 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-100">
          <span className="sr-only">LLM params settings</span>
          <CircleStackIcon className="h-6 w-6" aria-hidden="true" />
        </Popover.Button>
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
        <Popover.Panel className="absolute bottom-full left-0 z-10 mb-3 ml-1 mt-2 w-52 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* Tokens Used */}
            <div className="relative overflow-hidden bg-white px-2 py-2">
              <dt>
                <div className="absolute rounded-md bg-green-600 p-3">
                  <CpuChipIcon
                    className="h-7 w-7 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-zinc-500">
                  Tokens Used
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-zinc-900">
                  {conversationTotalTokens}
                </p>
              </dd>
            </div>

            {/* LLM API Requests */}
            <div className="relative overflow-hidden bg-white px-2 py-2">
              <dt>
                <div className="absolute rounded-md bg-green-600 p-3">
                  <CodeBracketSquareIcon
                    className="h-7 w-7 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-zinc-500">
                  LLM API Requests
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-zinc-900">
                  {CC.conversation?.api_req_res_metadata.length || 0}
                </p>
              </dd>
            </div>

            {/* Messages */}
            <div className="relative overflow-hidden bg-white px-2 py-2">
              <dt>
                <div className="absolute rounded-md bg-green-600 p-3">
                  <ChatBubbleBottomCenterTextIcon
                    className="h-7 w-7 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-zinc-500">
                  Messages:
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-zinc-900">
                  {rowArrayLength}
                </p>
              </dd>
            </div>

            {/* Created At */}
            <div className="relative overflow-hidden bg-white px-2 py-2">
              <dt>
                <div className="absolute rounded-md bg-zinc-500 p-3">
                  <CpuChipIcon
                    className="h-7 w-7 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-zinc-500">
                  Created At
                </p>
              </dt>
              <dd className="ml-16 flex flex-col items-baseline">
                <p className="text-l font-semibold text-zinc-900">
                  {formattedDate}
                </p>
                <p className="text-l font-semibold text-zinc-900">
                  {formattedTime}
                </p>
              </dd>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
