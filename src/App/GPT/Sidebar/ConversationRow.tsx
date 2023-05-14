//-- react, react-router-dom, recoil, Auth0 --//
import { RefObject, SetStateAction } from "react";

//-- TSX Components --//
import * as chatson from "../chatson/chatson";

//-- NPM Components --//
import TextareaAutosize from "react-textarea-autosize";

//-- Icons --//
import { CalendarDaysIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  TrashIcon,
  PencilSquareIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

//-- NPM Functions --//
import { format, isToday, isYesterday } from "date-fns";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";
import is420 from "../../../Util/is420";

//-- Data Objects, Environment Variables --//

//-- Types --//
import { IConversation } from "../chatson/chatson_types";
import { IChatContext } from "../../../Context/ChatContext";
import { NavigateFunction } from "react-router-dom";

//-- Conversation Rows with Sticky Header Logic --//
export const ConversationRow = (
  index: number,
  row: IConversation,
  CC: IChatContext,
  getAccessTokenSilently: Function,
  rowHoverId: string | null,
  setRowHoverId: React.Dispatch<SetStateAction<string | null>>,
  activeDeleteRowId: string | null,
  setActiveDeleteRowId: React.Dispatch<SetStateAction<string | null>>,
  textareaRef: RefObject<HTMLTextAreaElement>,
  setTextareaOnFocusToggle: React.Dispatch<SetStateAction<boolean>>,
  activeEditRowId: string | null,
  setActiveEditRowId: React.Dispatch<SetStateAction<string | null>>,
  newTitleDraft: string,
  setNewTitleDraft: React.Dispatch<SetStateAction<string>>,
  retitleLoading: boolean,
  setRetitleLoading: React.Dispatch<SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  //-- Compute sticky header text --//
  let sortByDate = new Date(row[CC.sortBy]);

  let stickyHeaderText = format(sortByDate, "EEE, MMM d");
  if (isToday(sortByDate)) {
    stickyHeaderText += " - Today";
  } else if (isYesterday(sortByDate)) {
    stickyHeaderText += " - Yesterday";
  }
  //-- Strategically Significant --//
  else if (is420(sortByDate)) {
    stickyHeaderText += " - :)";
  }

  //-- Format timestamps --//
  const formattedTime: string = sortByDate
    ? format(sortByDate, "h:mm aaa")
    : "";

  //-- Show sticky header for first item and when date changes --//
  let showStickyHeader: boolean = false;
  if (index > 0) {
    let previousRowSortByDate = new Date(
      CC.conversationsArray[index - 1][CC.sortBy]
    );
    showStickyHeader = sortByDate.getDate() != previousRowSortByDate.getDate();
  } else {
    showStickyHeader = true;
  }

  //-- Set conversationId --//
  const setConversationIdHandler = async (row: IConversation) => {
    navigate(`/gpt/c/${row._id}`); // NEW
    // CC.setConversationId(row._id);
  };

  //-- Hover handlers --//
  const mouseEnterHandler = () => {
    setRowHoverId(row._id);
  };
  const mouseLeaveHandler = () => {
    setRowHoverId(null); // any conflict here?
  };

  //-- Delete Conversation Handler --//
  const deleteConversationHandler = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveDeleteRowId(row._id);
  };

  const confirmDeleteHandler = async (event: React.MouseEvent) => {
    event.stopPropagation();
    let accessToken = await getAccessTokenSilently();
    chatson.delete_conversation_and_messages(
      accessToken,
      row._id,
      CC,
      navigate
    );
    setActiveDeleteRowId(null);
  };

  //-- Edit Title Handler --//
  const editTitleHandler = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setNewTitleDraft(row.title || "New conversation");
    setActiveEditRowId(row._id);
    textareaRef.current?.focus();
  };

  const confirmEditHandler = async (event?: React.MouseEvent) => {
    event?.stopPropagation();
    console.log("todo - confirmEditHandler with title: ", newTitleDraft); // DEV
    // on click of confirmEdit button, send the value of the textarea input to the titles endpoint
    let accessToken = await getAccessTokenSilently();
    setRetitleLoading(true);
    await chatson.retitle(accessToken, CC, row._id, newTitleDraft);
    setRetitleLoading(false);
    setActiveEditRowId(null);
  };

  //-- 'Enter' w/o 'Shift' to submit prompt, 'Shift + Enter' for newline --//
  const keyDownHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); //-- Prevent default behavior (newline insertion) --//
      textareaRef.current?.blur();
      //-- prevent submit while title is loading --//
      if (!retitleLoading) {
        confirmEditHandler();
      }
    } //-- else "Enter" with shift will just insert a newline --//
  };

  return (
    <div>
      {/* START OF STICKY HEADER - Date */}
      <>
        {showStickyHeader && (
          <div className="sticky top-0 bg-zinc-50 dark:bg-zinc-950">
            <div className="mb-1 border-b-2 border-zinc-300 pb-1 pl-1 pt-1.5 text-sm font-semibold text-zinc-500 dark:border-zinc-500 dark:text-zinc-400">
              <div className="flex flex-row">
                <CalendarDaysIcon className="mr-1 h-5 w-5" />
                {stickyHeaderText}
              </div>
            </div>
          </div>
        )}
      </>
      {/* END OF STICKY HEADER - Date */}

      {/* START OF ROWS (each is a button) */}
      <div
        className={classNames(
          "mt-0.5 flex flex-col rounded-md px-1.5 pb-1 pt-0.5",
          CC.conversationId === row._id
            ? "bg-zinc-300 dark:bg-zinc-800"
            : "hover:bg-zinc-200 dark:hover:bg-zinc-900"
        )}
      >
        <button
          onMouseEnter={mouseEnterHandler}
          onMouseLeave={mouseLeaveHandler}
          onClick={() => {
            setConversationIdHandler(row);
          }}
        >
          {/* Title string */}
          <div>
            {activeEditRowId === row._id ? (
              <TextareaAutosize
                autoFocus
                onFocus={() =>
                  setTextareaOnFocusToggle((prevState) => !prevState)
                }
                ref={textareaRef}
                value={newTitleDraft}
                maxRows={2}
                wrap="hard"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onKeyDown={keyDownHandler}
                onChange={(event) => {
                  setNewTitleDraft(event.target.value);
                }}
                className={classNames(
                  retitleLoading
                    ? "animate-pulse bg-zinc-300 dark:bg-zinc-500"
                    : "",
                  "mb-0.5 block w-full resize-none rounded-md border-0 bg-white px-0 py-0 text-sm font-normal text-zinc-900 ring-2 ring-green-600 focus:ring-2 focus:ring-green-600 dark:bg-zinc-700 dark:text-zinc-100"
                )}
              />
            ) : (
              <p
                className={classNames(
                  "line-clamp-2 text-left text-sm font-normal",
                  CC.conversationId === row._id
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-900 dark:text-zinc-200"
                )}
              >
                {row.title && !/^\s*$/.test(row.title)
                  ? row.title
                  : "New conversation"}
              </p>
            )}
          </div>

          {/* Start of Conversation Stats */}
          <div className="flex flex-row">
            {/* Request count */}
            <p
              className={classNames(
                "text-left text-sm italic",
                CC.conversationId === row._id
                  ? "text-zinc-500 dark:text-zinc-400"
                  : "text-zinc-500 dark:text-zinc-500"
              )}
            >
              {row.api_req_res_metadata.length === 1
                ? `${row.api_req_res_metadata.length} request`
                : `${row.api_req_res_metadata.length} requests`}
            </p>

            {/* Time */}
            <p
              className={classNames(
                "flex-grow text-right text-sm font-medium",
                CC.conversationId === row._id
                  ? "text-zinc-500 dark:text-zinc-400"
                  : "text-zinc-500 dark:text-zinc-500"
              )}
            >
              {formattedTime}
            </p>

            {/* Conditionally render Delete and Edit Buttons based on hover state and CC */}
            <div className="flex flex-row">
              {rowHoverId === row._id &&
                !activeDeleteRowId &&
                !activeEditRowId &&
                !retitleLoading && (
                  <>
                    {/* Delete Conversation Button */}
                    <div
                      className={classNames(
                        "-mt-0.5 ml-1 flex cursor-pointer flex-row justify-center rounded-full p-0.5",
                        "text-zinc-500 hover:bg-red-600 hover:bg-opacity-20 hover:text-red-600",
                        " dark:text-zinc-500 dark:hover:bg-red-600 dark:hover:bg-opacity-20 dark:hover:text-red-600"
                      )}
                      onClick={deleteConversationHandler}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </div>

                    {/* Edit Title Button */}
                    <div
                      className={classNames(
                        "-mt-1 ml-1 flex cursor-pointer flex-row justify-center rounded-full p-0.5",
                        "text-zinc-500 hover:bg-green-600 hover:bg-opacity-20 hover:text-green-600",
                        " dark:text-zinc-500 dark:hover:bg-green-600 dark:hover:bg-opacity-20 dark:hover:text-green-600"
                      )}
                      onClick={editTitleHandler}
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </div>
                  </>
                )}

              {/* Confirm / Cancel Delete */}
              {activeDeleteRowId === row._id && !retitleLoading && (
                <>
                  <div
                    className={classNames(
                      "-mt-1 ml-1 flex cursor-pointer flex-row justify-center rounded-full p-0.5",
                      "text-zinc-500 hover:text-blue-500",
                      "dark:text-zinc-500 dark:hover:text-blue-500"
                    )}
                    onClick={(event) => {
                      setActiveDeleteRowId(null);
                      event.stopPropagation();
                    }}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </div>
                  <div
                    className={classNames(
                      "-mt-1 flex cursor-pointer flex-row justify-center rounded-full p-0.5",
                      "text-zinc-500 hover:text-blue-500",
                      "dark:text-zinc-500 dark:hover:text-blue-500"
                    )}
                    onClick={confirmDeleteHandler}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </div>
                </>
              )}
              {/* Confirm / Cancel Edit */}
              {activeEditRowId === row._id && !retitleLoading && (
                <>
                  <div
                    className={classNames(
                      "-mt-0.5 ml-1 flex cursor-pointer flex-row justify-center rounded-full p-0.5",
                      "text-zinc-500 hover:text-blue-500",
                      "dark:text-zinc-500 dark:hover:text-blue-500"
                    )}
                    onClick={(event) => {
                      setActiveEditRowId(null);
                      event.stopPropagation();
                    }}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </div>
                  <div
                    className={classNames(
                      "-mt-0.5 flex cursor-pointer flex-row justify-center rounded-full p-0.5",
                      "text-zinc-500 hover:text-blue-500",
                      "dark:text-zinc-500 dark:hover:text-blue-500"
                    )}
                    onClick={confirmEditHandler}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </div>
                </>
              )}
            </div>
          </div>
          {/* End of Conversation Stats */}
        </button>
      </div>
      {/* END OF ROWS (each is a button) */}
    </div>
  );
};
