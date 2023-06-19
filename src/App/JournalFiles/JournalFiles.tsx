//-- react, react-router-dom, Auth0 --//
import { Fragment, useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useJournalContext } from "../../Context/JournalContext";

//-- TSX Components --//
import FileDropArea from "./FileDropArea";
import CTA401Fallback from "./CTA401Fallback";
import { axiosErrorToaster } from "../../Errors/axiosErrorToaster";

//-- NPM Components --//
import { Listbox, Dialog, Transition } from "@headlessui/react";

//-- Icons --//
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//
import axios, { AxiosError } from "axios";
import { saveAs } from "file-saver";

import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";

//-- Utility Functions --//
import orderBy from "lodash/orderBy";
import classNames from "../../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
import { IFileMetadata } from "./types";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;
interface IBrokerage {
  id: number;
  nickname: string;
  name: string;
}
const brokerages: IBrokerage[] = [
  //-- Server only ever sees 'name', not 'nickname' --//
  { id: 0, nickname: "TD Ameritrade", name: "td_ameritrade" },
  // { id: 1, nickname: "TradeZero", name: "tradezero" },
  // { id: 2, nickname: "Webull", name: "webull" },
];

interface ITableRow {
  id: number;
  name: string;
  nickname: string;
  classes: string;
}
const tableColumns: ITableRow[] = [
  { id: 0, name: "", nickname: "", classes: "" }, //-- Checkbox column --//
  {
    id: 1,
    name: "filename",
    nickname: "Filename",
    classes: "sm:pl-6",
  },
  { id: 2, name: "brokerage", nickname: "Brokerage", classes: "" },
  { id: 3, name: "last_modified", nickname: "Uploaded", classes: "" },
  { id: 4, name: "size_mb", nickname: "Size (MB)", classes: "" },
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {}
export default function JournalFiles({}: IProps) {
  //-- React State --//

  let JournalContext = useJournalContext();

  const [selectedBrokerage, setSelectedBrokerage] = useState<IBrokerage>(
    brokerages[0]
  );

  const [putFilename, setPutFilename] = useState<string | null>(null);
  const [putFileData, setPutFileData] = useState<Blob | null>(null);

  const [listFilesLoading, setListFilesLoading] = useState<boolean>(false);
  const [getFileLoading, setGetFileLoading] = useState<boolean>();
  const [putFileLoading, setPutFileLoading] = useState<boolean>();
  const [deleteFileLoading, setDeleteFileLoading] = useState<boolean>();

  const [tableSelectionFile, setTableSelectionFile] =
    useState<IFileMetadata | null>(null);
  const [currentSort, setCurrentSort] = useState<string>("last_modified_desc");

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false); //-- <Transition show={} /> requies false, not null --//
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

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
      JournalContext.setFilesList(res.data);
      //----//
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "List Files");
      }
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
        `${VITE_ALB_BASE_URL}/journal_files/get_file/${selectedBrokerage.name}/${tableSelectionFile?.file_uuid}_${tableSelectionFile?.filename}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //-- Handle reponse by downloading file --//
      let blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
      saveAs(blob, tableSelectionFile?.filename);
      //----//
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Get File");
      }
    }

    setGetFileLoading(false);
  };

  const putFile = async () => {
    //-- Get access token from memory or request new token --//
    let accessToken = await getAccessTokenSilently();

    let formData = new FormData();
    formData.append("file", putFileData || "");

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
    } catch (err: any) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 415) {
          toast("File type not supported. Please upload a CSV file.");
        } else if (err.response?.status === 401) {
          toast("Journal access required");
        } else {
          axiosErrorToaster(err, "Put File");
        }
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
      await axios.delete(
        `${VITE_ALB_BASE_URL}/journal_files/delete_file/${selectedBrokerage.name}/${tableSelectionFile?.file_uuid}_${tableSelectionFile?.filename}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //----//
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Delete File");
      }
    }
    setDeleteFileLoading(false);
    setTableSelectionFile(null);
    setDeleteModalOpen(false);

    listFiles(); //-- Refresh files list --//
  };

  //-- Other --//
  const getBrokerageNickname = (brokerageName: string) => {
    const nickname = brokerages.find((x) => x.name === brokerageName);
    return nickname?.nickname || null;
  };

  const getSortIcon = (tableColumn: ITableRow) => {
    if (tableColumn.name === "") {
      return null; //-- Checkbox column - no sort icon --//
    } else if (currentSort === `${tableColumn.name}_desc`) {
      return (
        <ChevronDownIcon
          className="h-5 w-5 bg-green-200 dark:bg-green-800"
          aria-hidden="true"
        />
      );
    } else if (currentSort === `${tableColumn.name}_asc`) {
      return (
        <ChevronUpIcon
          className="h-5 w-5 bg-green-200 dark:bg-green-800"
          aria-hidden="true"
        />
      );
    } else {
      return (
        <ChevronUpDownIcon className="h-5 w-5 bg-zinc-200 dark:bg-zinc-700" />
      );
    }
  };

  const getLocalTime = (last_modified: string) => {
    let date = parseISO(last_modified);
    let localTime = format(date, "MMM dd, yyyy @ hh:mm:ss aaa");
    return localTime;
  };

  //-- Click Handlers --//
  const sortByHandler = (columnName: string) => {
    //-- Sort ('_.orderBy') descending. But if already sorted descending, sort ascending. --//
    const sortedFilesList = orderBy(
      JournalContext.filesListState, //-- array --// // TODO - test this
      [columnName], //-- column to order by --//
      [currentSort === `${columnName}_desc` ? "asc" : "desc"] //-- asc or desc --//
    );
    JournalContext.setFilesList(sortedFilesList);
    setCurrentSort(
      currentSort === `${columnName}_desc`
        ? `${columnName}_asc`
        : `${columnName}_desc`
    );
  };

  //-- Side Effects --//
  useEffect(() => {
    listFiles();
  }, []);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div
      id="journal-files"
      className="relative mt-6 flex h-full flex-col justify-start"
    >
      <CTA401Fallback />

      {/* START OF FILE UPLOAD AREA */}
      <FileDropArea
        setPutFilename={setPutFilename}
        setPutFileData={setPutFileData}
      />
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
                          {({ active }) => (
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
                  putFilename ? "bg-green-100 dark:bg-green-900" : "",
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
                putFileLoading ? "animate-pulse cursor-wait opacity-30" : "",
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
                      listFilesLoading
                        ? "animate-pulse bg-green-100 dark:bg-green-900"
                        : "",
                      "bg-zinc-100 dark:bg-zinc-900"
                    )}
                  >
                    {/* Map tableColumns array into table headers */}
                    <tr>
                      {tableColumns.map((tableColumn) => {
                        return (
                          <th
                            key={tableColumn.id}
                            scope="col"
                            className={classNames(
                              tableColumn.classes,
                              "px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                            )}
                          >
                            {/* Column Name */}
                            <a
                              onClick={() => {
                                sortByHandler(tableColumn.name);
                              }}
                              className="group inline-flex cursor-pointer"
                            >
                              {tableColumn.nickname}

                              {/* Sort Descending / Ascending Icon */}
                              <span className="ml-2 flex-none rounded bg-zinc-200 text-zinc-900 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:group-hover:bg-zinc-500">
                                {getSortIcon(tableColumn)}
                              </span>
                              {/*----*/}
                            </a>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-800">
                    {JournalContext.filesListState.map((file, fileIdx) => (
                      <tr
                        key={file.id}
                        className={classNames(
                          "odd:bg-white even:bg-zinc-100 dark:odd:bg-zinc-700 dark:even:bg-zinc-800", //-- Striped Rows --//
                          tableSelectionFile?.file_uuid === file.file_uuid
                            ? "bg-green-100 dark:bg-green-900"
                            : "" //-- Selected Row --> Green --//
                        )}
                      >
                        {/* Checkbox */}
                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                          {tableSelectionFile?.file_uuid === file.file_uuid && (
                            <div className="absolute inset-y-0 left-0 w-1.5 bg-green-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-600 sm:left-6"
                            // value={file.email}
                            checked={
                              tableSelectionFile?.file_uuid === file.file_uuid
                            }
                            onChange={(e) =>
                              e.target.checked //-- e.target.checked is the status after the onChange event --//
                                ? setTableSelectionFile(file)
                                : setTableSelectionFile(null)
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
                          {getLocalTime(file.last_modified)}
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
            !tableSelectionFile?.filename ||
            JournalContext.filesListState[0].filename === "exampleFileName.csv"
          }
          type="button"
          className={classNames(
            getFileLoading ? "animate-pulse cursor-wait opacity-30" : "",
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
            !tableSelectionFile?.filename ||
            JournalContext.filesListState[0].filename === "exampleFileName.csv"
          }
          type="button"
          className={classNames(
            deleteFileLoading ? "animate-pulse cursor-wait opacity-30" : "",
            "inline-flex items-center rounded-md border border-transparent bg-rose-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-rose-700 focus:outline-none disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:hover:bg-zinc-100 dark:disabled:border-zinc-300 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-100"
          )}
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete
        </button>
        {/* END OF DELETE BUTTON */}

        {/* START OF DELETE BUTTON MODAL */}
        <Transition.Root show={deleteModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setDeleteModalOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-rose-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        {/* <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-zinc-900"
                        >
                          Delete File
                        </Dialog.Title> */}
                        <div className="mt-2">
                          <p className="text-sm text-zinc-900">
                            Deleting a file will remove its data from your
                            Journal.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
                        onClick={deleteFile}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-base font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setDeleteModalOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        {/* END OF DELETE BUTTON MODAL */}
      </div>
      {/* END OF DOWNLOAD AND DELETE BUTTONS SECTION */}
    </div>
  );
}
