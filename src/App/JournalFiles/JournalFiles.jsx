//-- react, react-router-dom, recoil, Auth0 --//
import { Fragment, useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { filesListState } from "./atoms";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//
import { Listbox, Transition } from "@headlessui/react";

//-- Icons --//
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { FolderIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//
import axios from "axios";
import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";

//-- Utility Functions --//
import orderBy from "lodash/orderBy";
import getUserDbId from "../Util/getUserDbId";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//-- Data Objects, Environment Variables --//
const brokerages = [
  //-- Server only ever sees 'name', not 'nickname' --//
  { id: 0, nickname: "TD Ameritrade", name: "td_ameritrade" },
  // { id: 1, nickname: "TradeZero", name: "tradezero" },
  // { id: 2, nickname: "Webull", name: "webull" },
];
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function JournalFiles() {
  //-- React State --//
  const [selectedBrokerage, setSelectedBrokerage] = useState(brokerages[0]);

  const [putFilename, setPutFilename] = useState();
  const [putFileData, setPutFileData] = useState();

  const [listFilesLoading, setListFilesLoading] = useState();
  const [getFileLoading, setGetFileLoading] = useState();
  const [putFileLoading, setPutFileLoading] = useState();
  const [deleteFileLoading, setDeleteFileLoading] = useState();

  const [tableSelectionFilename, setTableSelectionFilename] = useState();
  const [currentSort, setCurrentSort] = useState("last_modified_iso8601_desc");

  //-- Recoil State --//
  const [filesList, setFilesList] = useRecoilState(filesListState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Data Fetching --//
  const listFiles = async () => {
    //-- Get access token from memory or request new token --//
    let accessToken = await getAccessTokenSilently();

    setListFilesLoading(true);
    try {
      //-- Make GET request --//
      let res = await axios.get(
        `${VITE_ALB_BASE_URL}/journal_files/list_files`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setFilesList(res.data);
      //----//
    } catch (err) {
      console.log(err);
    }
    setListFilesLoading(false);
  };

  const getFile = async () => {
    //-- Get access token from memory or request new token --//
    let accessToken = await getAccessTokenSilently();

    setGetFileLoading(true);
    try {
      //-- Make GET request --//
      let res = await axios.get(
        `${VITE_ALB_BASE_URL}/journal_files/get_file/${selectedBrokerage.name}/${tableSelectionFilename}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //-- Handle reponse by downloading file --//
      let blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
      saveAs(blob, tableSelectionFilename);
      //----//
    } catch (err) {
      console.log(err);
    }
    setGetFileLoading(false);
  };

  const putFile = async () => {
    //-- Get access token from memory or request new token --//
    let accessToken = await getAccessTokenSilently();

    let formData = new FormData();
    formData.append("file", putFileData);

    setPutFileLoading(true);
    try {
      //-- Make POST request --//
      await axios.put(
        `${VITE_ALB_BASE_URL}/journal_files/put_file/${selectedBrokerage.name}/${putFilename}`,
        //-- Body Content --//
        formData,
        //-- Headers --//
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //----//
    } catch (err) {
      console.log(err.message);
      if ((err.response.status = 415)) {
        alert("File type not supported. Please upload a CSV file."); // DEV
      }
    }
    setPutFileLoading(false);

    //-- Reset file upload data and name --//
    setPutFileData(null);
    setPutFilename(null);

    listFiles(); //-- Refresh files list --//
  };

  const deleteFile = async () => {
    setDeleteFileLoading(true);
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make DELETE request --//
      let res = await axios.delete(
        `${VITE_ALB_BASE_URL}/journal_files/delete_file/${selectedBrokerage.name}/${tableSelectionFilename}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //----//
    } catch (err) {
      console.log(err);
    }
    setDeleteFileLoading(false);
    setTableSelectionFilename(null);

    listFiles(); //-- Refresh files list --//
  };

  //-- Other --//
  const onDrop = useCallback((acceptedFiles) => {
    setPutFileData(acceptedFiles[0]);
    setPutFilename(acceptedFiles[0].name);
  });
  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "text/csv": [".csv"],
      },
      maxFiles: 1,
      maxSize: 10485760, //-- 10 MB --//
      onDrop: onDrop,
    });
  const fileUploadHandler = (event) => {
    let file = event?.target?.files[0];
    //-- Check file size --//
    if (file?.size < 10 * 1024 * 1024) {
      alert("File size limit is 10 MB");
    } else {
      setPutFileData(file);
      setPutFilename(file?.name);
    }
  };

  const getBrokerageNickname = (brokerageName) => {
    const nickname = brokerages.find((x) => x.name === brokerageName);
    return nickname?.nickname || null;
  };

  // TODO - clean up sort icon logic :)
  let filenameSortIcon = <ChevronUpDownIcon className="h-5 w-5 bg-gray-200" />;
  if (currentSort === "filename_desc") {
    filenameSortIcon = (
      <ChevronDownIcon className="h-5 w-5 bg-green-200" aria-hidden="true" />
    );
  } else if (currentSort === "filename_asc") {
    filenameSortIcon = (
      <ChevronUpIcon className="h-5 w-5 bg-green-200" aria-hidden="true" />
    );
  }
  let brokerageSortIcon = <ChevronUpDownIcon className="h-5 w-5 bg-gray-200" />;
  if (currentSort === "brokerage_desc") {
    brokerageSortIcon = (
      <ChevronDownIcon className="h-5 w-5  bg-green-200" aria-hidden="true" />
    );
  } else if (currentSort === "brokerage_asc") {
    brokerageSortIcon = (
      <ChevronUpIcon className="h-5 w-5 bg-green-200" aria-hidden="true" />
    );
  }
  let lastModifiedSortIcon = (
    <ChevronUpDownIcon className="h-5 w-5 bg-gray-200" />
  );
  if (currentSort === "last_modified_iso8601_desc") {
    lastModifiedSortIcon = (
      <ChevronDownIcon className="h-5 w-5 bg-green-200" aria-hidden="true" />
    );
  } else if (currentSort === "last_modified_iso8601_asc") {
    lastModifiedSortIcon = (
      <ChevronUpIcon className="h-5 w-5 bg-green-200" aria-hidden="true" />
    );
  }
  let sizeSortIcon = <ChevronUpDownIcon className="h-5 w-5 bg-gray-200" />;
  if (currentSort === "size_mb_desc") {
    sizeSortIcon = (
      <ChevronDownIcon className="h-5 w-5 bg-green-200" aria-hidden="true" />
    );
  } else if (currentSort === "size_mb_asc") {
    sizeSortIcon = (
      <ChevronUpIcon className="h-5 w-5 bg-green-200" aria-hidden="true" />
    );
  }
  //----//

  //-- Click Handlers --//
  const sortByHandler = (columnName) => {
    //-- Sort ('_.orderBy') descending. But if already sorted descending, sort ascending. --//
    const sortedFilesList = orderBy(
      filesList, //-- array --//
      [columnName], //-- column to order by --//
      [currentSort === `${columnName}_desc` ? "asc" : "desc"] //-- asc or desc --//
    );
    setFilesList(sortedFilesList);
    setCurrentSort(
      currentSort === `${columnName}_desc`
        ? `${columnName}_asc`
        : `${columnName}_desc`
    );
  };

  console.log(currentSort); // DEV

  //-- Side Effects --//
  useEffect(() => {
    listFiles();
  }, []);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex flex-col justify-center">
      {/* START OF FILE UPLOAD AREA */}
      <form className="mt-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <div
              {...getRootProps()}
              className={classNames(
                isDragAccept ? "bg-green-200" : "",
                isDragReject ? "bg-orange-200" : "",
                "flex cursor-pointer justify-center rounded-md border-2 border-dashed border-zinc-300 px-6 pt-5 pb-6 hover:bg-green-100 dark:hover:bg-green-900"
              )}
            >
              <input {...getInputProps()} />
              <div className="space-y-1 text-center">
                <FolderIcon className="mx-auto h-10 w-10 text-zinc-400" />
                <div className="flex text-sm text-zinc-600">
                  <label
                    htmlFor="file-upload"
                    className="hover-within:outline-none hover-within:ring-2 hover-within:ring-green-500 hover-within:ring-offset-2 relative cursor-pointer rounded-md bg-green-100 px-1 font-medium text-green-600 dark:bg-green-900 dark:text-white"
                  >
                    <span>Select a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv"
                      onChange={fileUploadHandler}
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
                      {selectedBrokerage.nickname}
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
                                {brokerage.nickname}
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

        {/* START OF TEXT INPUT FOR FILENAME + UPLOAD BUTTON*/}
        <div className="col-span-6 lg:col-span-5">
          <label
            htmlFor="filename-input"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-100"
          >
            Filename
          </label>

          <div className="shadow-l-md mt-1 flex">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                type="text"
                name="filename-input"
                id="filename-input"
                value={putFilename ? putFilename : ""}
                onChange={(event) => setPutFilename(event.target.value)}
                className={classNames(
                  putFileLoading
                    ? "animate-pulse bg-green-400 opacity-30 dark:bg-green-900"
                    : "",
                  "block w-full min-w-0 flex-1 rounded-l-md border-zinc-300 px-3 py-2 focus:border-green-500 focus:ring-green-500 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100 sm:text-sm"
                )}
                placeholder="some_file_name.csv"
              />
            </div>

            <button
              disabled={!putFileData}
              type="button"
              className={classNames(
                putFileLoading
                  ? "animate-pulse cursor-not-allowed opacity-30"
                  : "",
                "relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white hover:border-green-700 hover:bg-green-700 focus:outline-none focus:ring-0 disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:hover:bg-zinc-100 dark:border-green-700 dark:bg-green-700 dark:hover:border-green-600 dark:hover:bg-green-600 dark:disabled:border-zinc-500 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-100"
              )}
              onClick={putFile}
            >
              <span>Upload</span>
            </button>
          </div>
        </div>
        {/* END OF TEXT INPUT FOR FILENAME + UPLOAD BUTTON */}
      </div>

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

                      {/* Filename Column */}
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                      >
                        <a
                          onClick={() => {
                            sortByHandler("filename");
                          }}
                          className="group inline-flex cursor-pointer"
                        >
                          Filename
                          <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
                            {/* Sort Icon */}
                            {filenameSortIcon}
                          </span>
                        </a>
                      </th>

                      {/* Brokerage Column */}
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        <a
                          onClick={() => {
                            sortByHandler("brokerage");
                          }}
                          className="group inline-flex cursor-pointer"
                        >
                          Brokerage
                          <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
                            {/* Sort Icon */}
                            {brokerageSortIcon}
                          </span>
                        </a>
                      </th>

                      {/* Uploaded / Last Modified Column */}
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        <a
                          onClick={() => {
                            sortByHandler("last_modified_iso8601");
                          }}
                          className="group inline-flex cursor-pointer"
                        >
                          Uploaded / Last Modified
                          <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
                            {/* Sort Icon */}
                            {lastModifiedSortIcon}
                          </span>
                        </a>
                      </th>

                      {/* Size (MB) Column */}
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        <a
                          onClick={() => {
                            sortByHandler("size_mb");
                          }}
                          className="group inline-flex cursor-pointer"
                        >
                          Size (MB)
                          <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
                            {/* Sort Icon */}
                            {sizeSortIcon}
                          </span>
                        </a>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-800">
                    {filesList.map((file, fileIdx) => (
                      <tr
                        key={file.id}
                        className={classNames(
                          fileIdx % 2 === 0
                            ? "bg-white dark:bg-zinc-700"
                            : "bg-zinc-100 dark:bg-zinc-800", //-- Striped Rows --//
                          tableSelectionFilename === file.filename
                            ? "bg-green-100 dark:bg-green-900"
                            : undefined //-- Selected Row --> Green --//
                        )}
                      >
                        {/* Checkbox */}
                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                          {tableSelectionFilename === file.filename && (
                            <div className="absolute inset-y-0 left-0 w-1.5 bg-green-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-600 dark:bg-zinc-300 sm:left-6"
                            // value={file.email}
                            checked={tableSelectionFilename === file.filename}
                            onChange={(e) =>
                              e.target.checked //-- e.target.checked is the status after the onChange event --//
                                ? setTableSelectionFilename(file.filename)
                                : setTableSelectionFilename(null)
                            }
                          />
                        </td>

                        {/* Filename */}
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-white sm:pl-6">
                          {file.filename}
                        </td>

                        {/* Brokerage */}
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-700 dark:text-zinc-100">
                          {getBrokerageNickname(file.brokerage)}
                        </td>

                        {/* Uploaded / Last Modified */}
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-zinc-700 dark:text-zinc-100">
                          {file.last_modified_readable}
                        </td>

                        {/* Size (MB) */}
                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-sm font-medium text-zinc-700 dark:text-zinc-100 sm:pr-6">
                          {file.size_mb}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/*----*/}
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
          disabled={
            !tableSelectionFilename ||
            filesList[0].filename === "example_file_name.csv"
          }
          type="button"
          className={classNames(
            getFileLoading ? "animate-pulse cursor-not-allowed opacity-30" : "",
            "inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none  disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:hover:bg-zinc-100 dark:disabled:border-zinc-300 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-100"
          )}
          onClick={getFile}
        >
          Download
        </button>
        {/* END OF DOWNLOAD BUTTON */}

        {/* START OF DELETE BUTTON */}
        <button
          disabled={
            !tableSelectionFilename ||
            filesList[0].filename === "example_file_name.csv"
          }
          type="button"
          className={classNames(
            deleteFileLoading
              ? "animate-pulse cursor-not-allowed opacity-30"
              : "",
            "inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:hover:bg-zinc-100 dark:disabled:border-zinc-300 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-100"
          )}
          onClick={deleteFile}
        >
          Delete
        </button>
        {/* END OF DELETE BUTTON */}
      </div>
      {/* END OF DOWNLOAD AND DELETE BUTTONS SECTION */}
    </div>
  );
}
