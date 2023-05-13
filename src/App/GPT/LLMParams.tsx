//-- react, react-router-dom, recoil, Auth0 --//
import { Fragment, useState } from "react";
import { useChatContext } from "../../Context/ChatContext";

//-- TSX Components --//

//-- NPM Components --//
import { Popover, Transition } from "@headlessui/react";

//-- Icons --//
import {
  AdjustmentsHorizontalIcon,
  FireIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

export default function LLMParams() {
  //-- React State --//
  const CC = useChatContext();

  //-- Recoil State --//
  //-- Auth --//
  //-- Other [] --//

  //-- Side Effects --//
  //-- Click Handlers --//
  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <Popover as="div" className="relative inline-block text-left">
      <div>
        <Popover.Button className="flex items-center rounded-full align-middle text-zinc-600 hover:text-zinc-700 focus:outline-none dark:text-zinc-400 dark:hover:text-zinc-200">
          <span className="sr-only">LLM params settings</span>
          <AdjustmentsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
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
        {/* TODO - copy over popover.panel classnames from ConversationStats.tsx */}
        <Popover.Panel className="absolute bottom-full left-1/2 z-10 mb-3 mt-2 w-56 origin-top-right -translate-x-1/2 transform rounded-md bg-white shadow-lg ring-1 ring-transparent focus:outline-none dark:bg-zinc-900">
          <div className="flex flex-col py-1">
            {/* Temperature */}
            <div className="flex flex-row bg-white px-2 py-1 dark:bg-zinc-900">
              <div>
                {/*-- Icon --*/}
                <div
                  className={classNames(
                    "rounded-lg bg-yellow-600 p-3 dark:bg-yellow-700"
                  )}
                >
                  <FireIcon className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
              </div>

              {/*-- Title and Value --*/}
              <div>
                {/* Title */}
                <div>
                  <p className="ml-3 truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Temperature
                  </p>
                </div>

                {/* Value */}
                <div className="ml-3">
                  <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    {CC.temperature === null ? 1 : CC.temperature}
                  </p>
                </div>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="mx-2 flex flex-row items-center bg-white dark:bg-zinc-900">
              {/* Slider */}

              <input
                className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-zinc-200"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={CC.temperature === null ? 1 : CC.temperature}
                onChange={(event) => {
                  CC.setTemperature(parseFloat(event.target.value));
                }}
              />

              {/* Reset button */}
              <div>
                <button
                  type="button"
                  className="ml-2 flex items-center rounded-full bg-zinc-600 p-1 text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500"
                  onClick={() => CC.setTemperature(null)}
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
