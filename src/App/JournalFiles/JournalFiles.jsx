//-- react, react-router-dom, Auth0 --//
import { Fragment, useState } from "react";

//-- JSX Components --//

//-- NPM Components --//

import { Listbox, Transition } from "@headlessui/react";

//-- Icons --//
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
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

const files = [
  {
    name: "Jan_20-trading-history.csv",
    brokerage: "TD_Ameritrade",
    upload_date: "Jan 20, 2023",
    size_mb: "0.250",
  },
  {
    name: "Jan_21-trading-history.csv",
    brokerage: "TD_Ameritrade",
    upload_date: "Jan 21, 2023",
    size_mb: "0.250",
  },
  {
    name: "Jan_22-trading-history.csv",
    brokerage: "TD_Ameritrade",
    upload_date: "Jan 22, 2023",
    size_mb: "0.250",
  },
  {
    name: "Jan_23-trading-history.csv",
    brokerage: "TD_Ameritrade",
    upload_date: "Jan 23, 2023",
    size_mb: "0.250",
  },
  {
    name: "Jan_24-trading-history.csv",
    brokerage: "TD_Ameritrade",
    upload_date: "Jan 24, 2023",
    size_mb: "0.250",
  },
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function JournalFiles() {
  const [selectedBrokerage, setSelectedBrokerage] = useState(brokerages[0]); // TODO - fetch from localStorage
  const [selectedFile, setSelectedFile] = useState();

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
            <Listbox value={selectedBrokerage} onChange={setSelectedBrokerage}>
              {({ open }) => (
                <>
                  <Listbox.Label className="block text-sm font-medium text-zinc-700">
                    Brokerage
                  </Listbox.Label>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
                      <span className="block truncate">
                        {selectedBrokerage.name}
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
                            {({ selectedBrokerage, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selectedBrokerage
                                      ? "font-semibold"
                                      : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {brokerage.name}
                                </span>

                                {selectedBrokerage ? (
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
                {selectedBrokerage.name} /
              </span>
              <input
                type="text"
                name="company-website"
                id="company-website"
                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-zinc-300 px-3 py-2 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="Jan_20-trading-history.csv"
              />
            </div>
            <p className="mt-2 text-sm text-zinc-500" id="email-description">
              Optional: override the filename before upload
            </p>
          </div>
          {/* END OF TEXT INPUT FOR FILENAME */}

          {/* START OF UPLOAD BUTTON */}
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            UPLOAD
          </button>
          {/* END OF UPLOAD BUTTON */}
        </div>

        {/* START OF DATA TABLE - BROKERAGE FILES */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-zinc-900">Users</h1>
              <p className="mt-2 text-sm text-zinc-700">List of files</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-zinc-300">
                    {/* Table Headers */}
                    <thead className="bg-zinc-50">
                      <tr>
                        {/* Checkbox Column */}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900"
                        />

                        {/* Name Column */}
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 sm:pl-6"
                        >
                          <a href="#" className="group inline-flex">
                            Name
                            <span className="invisible ml-2 flex-none rounded text-zinc-400 group-hover:visible group-focus:visible">
                              <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          </a>
                        </th>

                        {/* Brokerage Column */}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900"
                        >
                          <a href="#" className="group inline-flex">
                            Brokerage
                            <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300">
                              <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          </a>
                        </th>

                        {/* Upload Date Column */}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900"
                        >
                          <a href="#" className="group inline-flex">
                            Upload Date
                            <span className="invisible ml-2 flex-none rounded text-zinc-400 group-hover:visible group-focus:visible">
                              <ChevronDownIcon
                                className="invisible ml-2 h-5 w-5 flex-none rounded text-zinc-400 group-hover:visible group-focus:visible"
                                aria-hidden="true"
                              />
                            </span>
                          </a>
                        </th>

                        {/* Size Column */}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900"
                        >
                          <a href="#" className="group inline-flex">
                            Size (MB)
                            <span className="invisible ml-2 flex-none rounded text-zinc-400 group-hover:visible group-focus:visible">
                              <ChevronDownIcon
                                className="invisible ml-2 h-5 w-5 flex-none rounded text-zinc-400 group-hover:visible group-focus:visible"
                                aria-hidden="true"
                              />
                            </span>
                          </a>
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {files.map((file, fileIdx) => (
                        <tr
                          key={file.email}
                          className={classNames(
                            fileIdx % 2 === 0 ? undefined : "bg-zinc-100", //-- Striped Rows --//
                            selectedFile === file.name
                              ? "bg-green-100"
                              : undefined //-- Selected Row --> Green --//
                          )}
                        >
                          {/*  */}
                          <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            {selectedFile === file.name && (
                              <div className="absolute inset-y-0 left-0 w-1.5 bg-green-600" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 sm:left-6"
                              value={file.email}
                              checked={selectedFile === file.name}
                              onChange={(e) =>
                                e.target.checked //-- e.target.checked is the status after the onChange event --//
                                  ? setSelectedFile(file.name)
                                  : setSelectedFile(null)
                              }
                            />
                          </td>
                          {/*  */}
                          <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-zinc-900 sm:pl-6">
                            {file.name}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-500">
                            {file.brokerage}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-500">
                            {file.upload_date}
                          </td>
                          <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-sm font-medium sm:pr-6">
                            {file.size_mb}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* END OF DATA TABLE - BROKERAGE FILES */}

        {/* START OF DOWNLOAD BUTTON */}
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Download
        </button>
        {/* END OF DOWNLOAD BUTTON */}

        {/* START OF DELETE BUTTON */}
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete
        </button>
        {/* END OF DELETE BUTTON */}
      </div>
    </form>
  );
}
