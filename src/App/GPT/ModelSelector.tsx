//-- react, react-router-dom, recoil, Auth0 --//
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
import { IModelFriendly, ModelAPINames } from "./chatson/chatson_types";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ModelSelector() {
  //-- React State --//
  const CC = useChatContext();

  //-- Recoil State --//
  //-- Auth --//
  //-- Other [] --//

  const getFriendly = (
    model_api_name: ModelAPINames,
    option:
      | "api_provider_friendly_name"
      | "model_developer_friendly_name"
      | "model_friendly_name"
      | "model_description"
  ) => {
    let modelFriendly: IModelFriendly | undefined;
    if (model_api_name && CC.model_friendly_names[model_api_name]) {
      modelFriendly = CC.model_friendly_names[model_api_name] as IModelFriendly;
    }
    if (modelFriendly) {
      return modelFriendly[option];
    }
    return "";
  };

  //-- Side Effects --//
  //-- Click Handlers --//
  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <Listbox value={CC.model} onChange={CC.setModel}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change GPT Model</Listbox.Label>

          <div className="relative">
            <Listbox.Button className="relative flex w-28 flex-row rounded-md bg-zinc-600 py-1.5 pr-5 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-50">
              {/*  */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {/* Selected Model Name */}
                  {getFriendly(CC.model.model_api_name, "model_friendly_name")}
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
              <Listbox.Options className="absolute bottom-full left-1/2 z-10 mb-2 w-48 origin-top-right -translate-x-1/2 transform divide-y divide-zinc-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-zinc-200 dark:bg-zinc-900">
                {Object.values(CC.model_options).map((model) => {
                  //-- Selected --//
                  const selected =
                    CC.model.model_api_name === model.model_api_name;
                  return (
                    <Listbox.Option
                      key={model.model_api_name}
                      className={({ active }) =>
                        classNames(
                          //-- Selected --//
                          selected ? "bg-green-600 dark:bg-green-700" : "",
                          //-- Active --//
                          active ? "bg-green-200 dark:bg-green-900" : "",
                          //-- Normal --//
                          "cursor-default select-none p-4 text-sm"
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
                                //-- Selected --//
                                selected
                                  ? "text-white"
                                  : "text-zinc-900 dark:text-white",
                                //-- Active --//
                                active ? "" : "",
                                //-- Normal --//
                                "font-bold"
                              )}
                            >
                              {getFriendly(
                                model.model_api_name,
                                "model_friendly_name"
                              )}
                            </p>

                            {/* Model Developer Name */}
                            <p
                              className={classNames(
                                //-- Active --//
                                active ? "" : "",
                                //-- Selected --//
                                selected
                                  ? "text-white dark:text-zinc-300"
                                  : "text-zinc-500 dark:text-zinc-400",
                                //-- Normal --//
                                "font-semibold"
                              )}
                            >
                              {getFriendly(
                                model.model_api_name,
                                "model_developer_friendly_name"
                              )}
                            </p>
                          </div>

                          {/* Model Description */}
                          <p
                            className={classNames(
                              // "text-zinc-500",
                              //-- Selected --//
                              selected
                                ? "text-green-200 dark:text-green-100"
                                : "text-zinc-700 dark:text-zinc-300",
                              //-- Active --//
                              active ? "" : "",
                              //-- Normal --//
                              "mt-2"
                            )}
                          >
                            {getFriendly(
                              model.model_api_name,
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
