//-- react, react-router-dom, recoil, Auth0 --//
import { useChatContext } from "../../Context/ChatContext";
import { Fragment, useState, useEffect } from "react";

//-- TSX Components --//

//-- NPM Components --//
import { Popover, Transition } from "@headlessui/react";

//-- Icons --//
import {
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  CircleStackIcon,
  ClockIcon,
  CodeBracketSquareIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
import { format, formatDistanceToNow } from "date-fns";
import classNames from "../../Util/classNames";

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
    : "-";
  const formattedTime: string = created_at
    ? format(new Date(created_at), "hh:mm:ss aaa")
    : "";
  const timeDistanceToNow = created_at
    ? formatDistanceToNow(new Date(created_at)) + " ago"
    : "-";

  //-- Side Effects --//
  useEffect(() => {
    let tokenCount: number = 0;
    CC.conversation?.api_req_res_metadata.forEach((x) => {
      tokenCount += x.total_tokens;
    });
    setConversationTotalTokens(tokenCount);
  }, [CC.conversation?.api_req_res_metadata]);

  //-- Stats Array --//
  interface IStatsItem {
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    iconBG: "bg-green-500" | "bg-zinc-500" | "bg-indigo-500";
    iconDarkBG: "dark:bg-green-700" | "dark:bg-zinc-700" | "dark:bg-indigo-700";
    title: string;
    value: string | number;
    value2?: string | number;
    valueTextSize: "text-sm" | "text-2xl";
  }
  const statsArray: IStatsItem[] = [
    {
      icon: CpuChipIcon,
      iconBG: "bg-green-500",
      iconDarkBG: "dark:bg-green-700",
      title: "Tokens Used",
      value: conversationTotalTokens,
      valueTextSize: "text-2xl",
    },
    {
      icon: CodeBracketSquareIcon,
      iconBG: "bg-green-500",
      iconDarkBG: "dark:bg-green-700",
      title: "LLM API Requests",
      value: CC.conversation?.api_req_res_metadata.length || 0,
      valueTextSize: "text-2xl",
    },
    {
      icon: ChatBubbleBottomCenterTextIcon,
      iconBG: "bg-green-500",
      iconDarkBG: "dark:bg-green-700",
      title: "Messages",
      value: rowArrayLength,
      valueTextSize: "text-2xl",
    },
    {
      icon: ClockIcon,
      iconBG: "bg-indigo-500",
      iconDarkBG: "dark:bg-indigo-700",
      title: "Created",
      value: timeDistanceToNow,
      valueTextSize: "text-sm",
    },
    {
      icon: CalendarDaysIcon,
      iconBG: "bg-zinc-500",
      iconDarkBG: "dark:bg-zinc-700",
      title: "Created on",
      value: formattedTime,
      value2: formattedDate,
      valueTextSize: "text-sm",
    },
  ];

  //-- Click Handlers --//
  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <Popover as="div" className="relative inline-block text-left">
      <div>
        <Popover.Button className="mx-2 flex items-center rounded-full align-middle text-zinc-600 hover:text-zinc-700 focus:outline-none dark:text-zinc-400 dark:hover:text-zinc-200">
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
        <Popover.Panel className="absolute bottom-full left-0 z-10 mb-3 ml-1 mt-2 w-52 rounded-md bg-white shadow-lg ring-1 ring-transparent ring-opacity-5 focus:outline-none dark:bg-zinc-900">
          <div className="flex flex-col py-1">
            {/* Stats Array items */}
            {statsArray.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row bg-white px-2 py-1 dark:bg-zinc-900"
                >
                  {/*-- Icon --*/}
                  <div>
                    <div
                      className={classNames(
                        item.iconBG,
                        item.iconDarkBG,
                        "rounded-md p-3"
                      )}
                    >
                      <item.icon
                        className="h-7 w-7 text-white"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/*-- Title and Value --*/}
                  <div>
                    {/* Title */}
                    <div>
                      <p className="ml-3 truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {item.title}
                      </p>
                    </div>

                    {/* Value */}
                    <div className={classNames("ml-3 flex-col")}>
                      <p
                        className={classNames(
                          item.valueTextSize,
                          "font-semibold text-zinc-900 dark:text-white"
                        )}
                      >
                        {item.value2}
                      </p>
                      <p
                        className={classNames(
                          item.valueTextSize,
                          "font-semibold text-zinc-900 dark:text-white"
                        )}
                      >
                        {item?.value}
                      </p>
                    </div>
                  </div>
                  {/*  */}
                </div>
              );
            })}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
