//-- react, react-router-dom, recoil, Auth0 --//
import { Fragment, useState, useContext } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

//-- TSX Components --//
import { ChatContext as _ChatContext } from "../../App";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

const publishingOptions = [
  {
    title: "Published",
    description: "This job posting can be viewed by anyone who has the link.",
    current: true,
  },
  {
    title: "Draft",
    description: "This job posting will no longer be publicly accessible.",
    current: false,
  },
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ModelSelector() {
  //-- React State --//
  const ChatContext = useContext(_ChatContext);

  //-- Recoil State --//
  //-- Auth --//
  //-- Other [] --//
  //-- Side Effects --//
  //-- Click Handlers --//
  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <Listbox value={ChatContext?.model} onChange={ChatContext?.setModel}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change GPT Model</Listbox.Label>

          <div className="relative">
            <Listbox.Button className="relative flex w-28 flex-row rounded-md bg-zinc-600 py-1.5 pr-5 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-50">
              {/*  */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {ChatContext?.model?.friendlyName}
                </p>
              </div>
              <div className="absolute right-0 mr-1.5 ">
                <ChevronDownIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </div>
              {/*  */}
              <span className="sr-only">Change GPT model</span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute bottom-full left-0 z-10 mb-2 w-72 origin-top-right divide-y divide-zinc-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {Object.values(ChatContext?.CurrentChatsonModels || {}).map(
                  (model) => (
                    <Listbox.Option
                      key={model?.apiName}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-green-600 text-white" : "text-zinc-900",
                          "cursor-default select-none p-4 text-sm"
                        )
                      }
                      value={model}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p
                              className={selected ? "font-bold" : "font-normal"}
                            >
                              {model?.friendlyName}
                            </p>
                          </div>
                          <p
                            className={classNames(
                              active ? "text-green-200" : "text-zinc-500",
                              "mt-2"
                            )}
                          >
                            {model?.description}
                          </p>
                        </div>
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
  );
}
