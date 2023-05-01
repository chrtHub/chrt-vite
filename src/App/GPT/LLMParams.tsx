//-- react, react-router-dom, recoil, Auth0 --//
import { useChatContext } from "../../Context/ChatContext";
import { Fragment } from "react";

//-- TSX Components --//

//-- NPM Components --//
import { Menu, Transition } from "@headlessui/react";

//-- Icons --//
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

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
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="mx-2 flex items-center rounded-full align-middle text-zinc-600 hover:text-zinc-700 focus:outline-none dark:text-zinc-400 dark:hover:text-zinc-200">
          <span className="sr-only">LLM params settings</span>
          <AdjustmentsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
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
        <Menu.Items className="absolute bottom-full left-1/2 z-10 mb-3 mt-2 w-56 origin-top-right -translate-x-1/2 transform rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    CC.setTemperature(1.5); // TESTING
                  }}
                >
                  <p
                    className={classNames(
                      active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Temperature 1.5
                  </p>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
