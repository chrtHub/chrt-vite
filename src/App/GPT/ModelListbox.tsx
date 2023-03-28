//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect, Fragment, useContext } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//

//-- NPM Components --//
import { Listbox, Transition } from "@headlessui/react";

//-- Icons --//
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
import { fooState } from "./atoms";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

import { ChatContext as _ChatContext } from "./GPT";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ModelListbox() {
  //-- React State --//
  const ChatContext = useContext(_ChatContext);

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
      <Listbox value={ChatContext.model} onChange={ChatContext.setModel}>
        {({ open }) => (
          <>
            <div className="relative w-80">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm sm:leading-6">
                <span className="inline-flex w-full truncate">
                  <span className="truncate">
                    {ChatContext.model.friendlyName}
                  </span>
                  <span className="ml-2 truncate text-zinc-500">
                    {ChatContext.model.description}
                  </span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-zinc-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {Object.values(ChatContext.CurrentChatsonModels).map(
                    (model) => (
                      <Listbox.Option
                        key={model.apiName}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-green-600 text-white"
                              : "text-zinc-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={model}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex">
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "truncate"
                                )}
                              >
                                {model.friendlyName}
                              </span>
                              <span
                                className={classNames(
                                  active ? "text-green-200" : "text-zinc-500",
                                  "ml-2 truncate"
                                )}
                              >
                                {model.description}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-green-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    )
                  )}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </>
  );
}
