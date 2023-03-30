//-- react, react-router-dom, recoil, Auth0 --//
import { Fragment, useState, useContext } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

//-- TSX Components --//
import { ChatContext as _ChatContext } from "./GPT";

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
    <Listbox value={ChatContext.model} onChange={ChatContext.setModel}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change GPT Model</Listbox.Label>

          <div className="relative">
            <Listbox.Button className="inline-flex w-24 justify-center rounded-md bg-green-600 p-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-50">
              <span className="sr-only">Change GPT model</span>
              <p className="text-sm font-semibold text-white">
                {ChatContext.model.friendlyName}
              </p>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-zinc-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {Object.values(ChatContext.CurrentChatsonModels).map(
                  (model) => (
                    <Listbox.Option
                      key={model.apiName}
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
                              {model.friendlyName}
                            </p>
                          </div>
                          <p
                            className={classNames(
                              active ? "text-green-200" : "text-zinc-500",
                              "mt-2"
                            )}
                          >
                            {model.description}
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
