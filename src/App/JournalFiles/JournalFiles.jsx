//-- react, react-router-dom, Auth0 --//
import { Fragment, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//
import { Listbox, Transition } from "@headlessui/react";

//-- Icons --//
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/20/solid";
import { TableCellsIcon, FolderIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//
import axios from "axios";
import useSWR from "swr";

//-- Utility Functions --//
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//-- env variables, Data Objects --//
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;
console.log(VITE_ALB_BASE_URL); // DEV

const brokerages = [
  { id: 1, name: "TD_Ameritrade" },
  { id: 2, name: "TradeZero" },
  { id: 3, name: "Webull" },
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function JournalFiles() {
  // TODO - fetch last-used value from localStorage (store it there, too)
  const [selectedBrokerage, setSelectedBrokerage] = useState(brokerages[0]);
  const [files, setFiles] = useState([
    {
      id: 0,
      filename: "example_file_name.csv",
      brokerage: "brokerage name",
      last_modified: "yyyy-MM-dd @ hh:mm:ss aaa",
      size_mb: "0",
    },
  ]);
  const [selectedFile, setSelectedFile] = useState();
  const [listFilesLoading, setListFilesLoading] = useState();

  //-- Auth0 --//
  const { getAccessTokenSilently } = useAuth0();

  //-- File requests: List, GET, PUT, DELETE --//
  const listFiles = async () => {
    console.log("listFiles");

    // TODO
    // fetch files list by making request to S3 API (add method for listing files for a user)
    // // while request in progress, show loading state
    // // any IAM persmissions needed for that API method?
    // format files list to be displayed in the data table
    // setFiles([ array of properly formatted files ])

    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      setListFilesLoading(true);
      let res = await axios.get(
        `${VITE_ALB_BASE_URL}/journal_files/list_files`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFiles(res.data);
      setListFilesLoading(false);
      //----//
    } catch (err) {
      console.log(err);
    }
  };
  //-- At first render, List Files --//
  useEffect(() => {
    listFiles();
  }, []);

  const getFileHandler = async () => {
    console.log("getFileHandler");

    // TODO
    // use selectedFile value to make a request to the S3 API
    // // while request in progress, show loading state

    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      let res = await axios.get(`https://chrts3.chrt.com/${some_variable}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res); // DEV
      //----//
    } catch (err) {
      console.log(err);
    }
  };

  const putFileHandler = async () => {
    console.log("putFileHandler: " + selectedFile);

    // TODO
    // How to get the file from the upload component?
    // Allow user to override the filename
    // make a request to the S3 API with brokerage name + filename
    // // while request in progress, show loading state

    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      let res = await axios.post(
        `https://chrts3.chrt.com/${some_variable}`,
        //-- Body Content --//
        {
          key1: "value1",
          key2: "value2",
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res); // DEV
      //----//
    } catch (err) {
      console.log(err);
    }

    listFiles(); //-- Refresh files list --//
  };

  const deleteFileHandler = async () => {
    console.log("deleteFileHandler");

    // TODO
    // use selectedFile value to make a request to the S3 API
    // // while request in progress, show loading state

    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      let res = await axios.delete(`https://chrts3.chrt.com/${some_variable}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res); // DEV
      //----//
    } catch (err) {
      console.log(err);
    }

    listFiles(); //-- Refresh files list --//
  };

  return (
    <div className="flex flex-col justify-center">
      {/* START OF FILE UPLOAD AREA */}
      <form className="mt-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <div className="flex justify-center rounded-md border-2 border-dashed border-zinc-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <FolderIcon className="mx-auto h-10 w-10 text-zinc-400" />
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
        </div>
      </form>
      {/* END OF FILE UPLOAD AREA */}

      {/* START OF BROKERAGE, FILENAME, UPLOAD BUTTON AREA */}
      <div className="mt-6 grid grid-cols-6 gap-x-3 gap-y-1">
        {/* START OF BROKERAGE SELECTOR */}
        <div className="col-span-6 lg:col-span-1">
          <Listbox value={selectedBrokerage} onChange={setSelectedBrokerage}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-100">
                  Brokerage
                </Listbox.Label>

                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-500 dark:bg-zinc-700 sm:text-sm">
                    <span className="block truncate text-black dark:text-zinc-100">
                      {selectedBrokerage.name}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-zinc-400 dark:text-zinc-200"
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
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-700 sm:text-sm">
                      {brokerages.map((brokerage) => (
                        <Listbox.Option
                          key={brokerage.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-green-600 text-white"
                                : "text-zinc-900 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100",
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
        {/* END OF BROKERAGE SELECTOR */}

        {/* START OF TEXT INPUT FOR FILENAME */}
        <div className="col-span-6 lg:col-span-5">
          <label
            htmlFor="company-website"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-100"
          >
            Filename
          </label>

          <div className="mt-1 flex rounded-l-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-300 bg-zinc-100 px-3 text-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-100 sm:text-sm">
                {selectedBrokerage.name} /
              </span>
              <input
                type="text"
                name="company-website"
                id="company-website"
                className="block w-full min-w-0 flex-1 rounded-none border-zinc-300 px-3 py-2 focus:border-green-500 focus:ring-green-500 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
                placeholder="some_file_name.csv"
              />
            </div>

            <button
              disabled={true} // TODO - base on logic of whether file is ready for upload
              type="button"
              className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white hover:border-green-700 hover:bg-green-700 focus:outline-none focus:ring-0 disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:hover:bg-zinc-100 dark:border-green-700 dark:bg-green-700 dark:hover:border-green-600 dark:hover:bg-green-600 dark:disabled:border-zinc-500 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-100"
              onClick={() => {
                console.log("Upload button clicked");
              }}
            >
              <span>Upload</span>
            </button>
          </div>
        </div>
        {/* END OF TEXT INPUT FOR FILENAME */}
      </div>
      {/* END OF BROKERAGE, FILENAME, UPLOAD BUTTON AREA */}

      {/* START OF DATA TABLE - BROKERAGE FILES */}
      <div className="mt-6">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full px-1 py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-zinc-300">
                  {/* Table Headers */}
                  <thead
                    className={classNames(
                      listFilesLoading &&
                        "animate-pulse bg-green-100 dark:bg-green-900",
                      "bg-zinc-100 dark:bg-zinc-900"
                    )}
                  >
                    <tr>
                      {/* Checkbox Column */}
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      />

                      {/* Name Column */}
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                      >
                        <a href="#" className="group inline-flex">
                          Filename
                          <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
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
                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        <a href="#" className="group inline-flex">
                          Brokerage
                          <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
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
                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        <a href="#" className="group inline-flex">
                          Uploaded / Last Modified
                          <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
                            <ChevronDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        </a>
                      </th>

                      {/* Size Column */}
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        <a href="#" className="group inline-flex">
                          Size (MB)
                          <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
                            <ChevronDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        </a>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-800">
                    {files.map((file, fileIdx) => (
                      <tr
                        key={file.id}
                        className={classNames(
                          fileIdx % 2 === 0
                            ? "bg-white dark:bg-zinc-700"
                            : "bg-zinc-100 dark:bg-zinc-800", //-- Striped Rows --//
                          selectedFile === file.filename
                            ? "bg-green-100 dark:bg-green-900"
                            : undefined //-- Selected Row --> Green --//
                        )}
                      >
                        {/*  */}
                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                          {selectedFile === file.filename && (
                            <div className="absolute inset-y-0 left-0 w-1.5 bg-green-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-600 dark:bg-zinc-300 sm:left-6"
                            // value={file.email}
                            checked={selectedFile === file.filename}
                            onChange={(e) =>
                              e.target.checked //-- e.target.checked is the status after the onChange event --//
                                ? setSelectedFile(file.filename)
                                : setSelectedFile(null)
                            }
                          />
                        </td>
                        {/*  */}
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-white sm:pl-6">
                          {file.filename}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-700 dark:text-zinc-100">
                          {file.brokerage}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-700 dark:text-zinc-100">
                          {file.last_modified}
                        </td>
                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-sm font-medium text-zinc-700 dark:text-zinc-100 sm:pr-6">
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

      {/* START OF DOWNLOAD AND DELETE BUTTONS SECTION */}
      <div className="mt-3 flex justify-between gap-x-7">
        {/* START OF DOWNLOAD BUTTON */}
        <button
          disabled={!selectedFile || files[0].filename === "---"}
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:hover:bg-zinc-100 dark:disabled:border-zinc-300 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-100"
          onClick={getFileHandler}
        >
          Download
        </button>
        {/* END OF DOWNLOAD BUTTON */}

        {/* START OF DELETE BUTTON */}
        <button
          disabled={!selectedFile || files[0].filename === "---"}
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:hover:bg-zinc-100 dark:disabled:border-zinc-300 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-100"
          onClick={deleteFileHandler}
        >
          Delete
        </button>
        {/* END OF DELETE BUTTON */}
      </div>
      {/* END OF DOWNLOAD AND DELETE BUTTONS SECTION */}
    </div>
  );
}
