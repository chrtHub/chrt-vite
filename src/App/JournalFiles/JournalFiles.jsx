//-- react, react-router-dom, Auth0 --//
import { Fragment, useState } from "react";

//-- JSX Components --//

//-- NPM Components --//

import { Listbox, Transition } from "@headlessui/react";

//-- Icons --//
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { TableCellsIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//-- Data Objects --//

const brokerages = [
  { id: 1, name: "TD_Ameritrade" },
  { id: 2, name: "TradeZero" },
  { id: 3, name: "Webull" },
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function JournalFiles() {
  const [selected, setSelected] = useState(brokerages[0]); // TODO - fetch from localStorage

  return (
    // TODO - evaluate the outer div classNames
    <form className="space-y-8 divide-y divide-zinc-200">
      <div className="space-y-8 divide-y divide-zinc-200">
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* UPLOAD FILE */}
          <div className="mx-3 sm:col-span-6">
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-zinc-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <TableCellsIcon className="mx-auto h-12 w-12 text-zinc-400" />
                <div className="flex text-sm text-zinc-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-green-100 px-1 font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-500 dark:bg-green-800 dark:text-green-200 dark:hover:text-white"
                  >
                    <span>Select a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1 dark:text-zinc-100">or drag and drop</p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-200">
                  CSV files up to 10MB
                </p>
              </div>
            </div>
          </div>
          {/* END OF UPLOAD FILE */}

          {/* SELECT BROKERAGE */}
          <div className="">
            <Listbox value={selected} onChange={setSelected}>
              {({ open }) => (
                <>
                  <Listbox.Label className="block text-sm font-medium text-zinc-700">
                    Brokerage
                  </Listbox.Label>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
                      <span className="block truncate">{selected.name}</span>
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
                        {brokerages.map((brokerage) => (
                          <Listbox.Option
                            key={brokerage.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-green-600 text-white"
                                  : "text-zinc-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={brokerage}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {brokerage.name}
                                </span>

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
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>
          {/* END OF SELECT BROKERAGE */}
          {/* START OF TEXT INPUT FOR FILENAME */}
          <div>
            <label
              htmlFor="company-website"
              className="block text-sm font-medium text-zinc-700"
            >
              Filename
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-zinc-500 sm:text-sm">
                {selected.name} /
              </span>
              <input
                type="text"
                name="company-website"
                id="company-website"
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-zinc-300 px-3 py-2 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Jan_20-trading-history.csv"
              />
            </div>
          </div>
          {/* END OF TEXT INPUT FOR FILENAME */}
        </div>
      </div>
    </form>
  );
}
