//-- react, react-router-dom, Auth0 --//
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

//-- TSX Components --//
import { useChatContext } from "../../Context/ChatContext";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../Util/classNames";
import getFriendly from "./chatson/Util/getFriendly";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ModelSelector() {
  //-- React State --//
  const CC = useChatContext();

  //-- Auth --//
  //-- Other [] --//

  //-- Side Effects --//
  //-- Click Handlers --//
  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <Listbox value={CC.model} onChange={CC.setModel}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change GPT Model</Listbox.Label>

          <div className="relative">
            <Listbox.Button className="relative flex w-32 flex-row rounded-md bg-zinc-600 py-1.5 pr-5 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-50">
              {/*  */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {/* Selected Model Name */}
                  {getFriendly(
                    CC.model.model_api_name,
                    CC.model_friendly_names,
                    "model_friendly_name"
                  )}
                </p>
              </div>
              <div className="absolute right-0 mr-1.5 ">
                <ChevronDownIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </div>
              <span className="sr-only">Change GPT model</span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute bottom-full left-1/2 z-10 mb-2 w-64 origin-top-right -translate-x-1/2 transform divide-y divide-zinc-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-zinc-200 dark:bg-zinc-800">
                {Object.values(CC.model_options).map((model) => {
                  //-- Selected --//
                  const selected =
                    CC.model.model_api_name === model.model_api_name;
                  return (
                    <Listbox.Option
                      key={model.model_api_name}
                      className={({ active }) =>
                        classNames(
                          //-- Normal --//
                          "cursor-pointer select-none p-4 text-sm",
                          //-- Selected --//
                          selected
                            ? "bg-green-600 dark:bg-green-700"
                            : //-- Active --//
                            active
                            ? "bg-green-200 dark:bg-green-900"
                            : ""
                        )
                      }
                      value={model}
                    >
                      {({ active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            {/* Model Name */}
                            <p
                              className={classNames(
                                //-- Normal --//
                                "font-bold",
                                //-- Selected --//
                                selected
                                  ? "text-white"
                                  : "text-zinc-600 dark:text-zinc-200"
                              )}
                            >
                              {getFriendly(
                                model.model_api_name,
                                CC.model_friendly_names,
                                "model_friendly_name"
                              )}
                            </p>

                            {/* Model Developer Name and link */}
                            <div className="flex flex-row">
                              <p
                                className={classNames(
                                  //-- Normal --//
                                  "font-semibold",
                                  //-- Selected --//
                                  selected
                                    ? "text-white dark:text-zinc-300"
                                    : "text-zinc-500 dark:text-zinc-400"
                                )}
                              >
                                {getFriendly(
                                  model.model_api_name,
                                  CC.model_friendly_names,
                                  "model_developer_friendly_name"
                                )}
                              </p>
                              <a
                                href={getFriendly(
                                  model.model_api_name,
                                  CC.model_friendly_names,
                                  "model_developer_link"
                                )}
                                target="_blank" //-- Open in new tab --//
                                onClick={(event) => {
                                  event.stopPropagation(); //-- Don't trigger model selection --//
                                }}
                              >
                                <ArrowTopRightOnSquareIcon
                                  className={classNames(
                                    //-- Normal --//
                                    "ml-1 h-4 w-4",
                                    //-- Selected --//
                                    selected
                                      ? "text-white dark:text-zinc-300"
                                      : "text-zinc-500 dark:text-zinc-400"
                                  )}
                                />
                              </a>
                            </div>
                          </div>

                          {/* Model Description */}
                          <p
                            className={classNames(
                              //-- Normal --//
                              "mt-2",
                              //-- Selected --//
                              selected
                                ? "text-green-200 dark:text-green-100"
                                : "text-zinc-700 dark:text-zinc-300"
                            )}
                          >
                            {getFriendly(
                              model.model_api_name,
                              CC.model_friendly_names,
                              "model_description"
                            )}
                          </p>
                        </div>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
