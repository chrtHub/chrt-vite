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

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ModelSelector() {
  //-- React State --//
  const CC = useChatContext();

  //-- Recoil State --//
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
            <Listbox.Button className="relative flex w-28 flex-row rounded-md bg-zinc-600 py-1.5 pr-5 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-50">
              {/*  */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {CC.model.friendly_name}
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
                {Object.values(CC.model_options).map((model) => (
                  <Listbox.Option
                    key={model.api_name}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "bg-green-600 text-white dark:bg-green-700"
                          : "text-zinc-900",
                        "cursor-default select-none p-4 text-sm"
                      )
                    }
                    value={model}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p className={"font-bold dark:text-white"}>
                            {model.friendly_name}
                          </p>
                        </div>
                        <p
                          className={classNames(
                            active ? "text-green-200" : "text-zinc-500",
                            "mt-2 dark:text-zinc-200"
                          )}
                        >
                          {model.description}
                        </p>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
