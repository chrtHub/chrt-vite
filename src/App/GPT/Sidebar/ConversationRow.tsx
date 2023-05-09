//-- react, react-router-dom, recoil, Auth0 --//

//-- TSX Components --//
import * as chatson from "../chatson/chatson";

//-- NPM Components --//

//-- Icons --//
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import {
  TrashIcon,
  PencilSquareIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

//-- NPM Functions --//
import { format, isToday, isYesterday } from "date-fns";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Environment Variables --//
import { IConversation } from "../chatson/chatson_types";
import { IChatContext } from "../../../Context/ChatContext";
import { SetStateAction } from "react";

//-- Conversation Rows with Sticky Header Logic --//
export const ConversationRow = (
  index: number,
  row: IConversation,
  CC: IChatContext,
  getAccessTokenSilently: Function,
  rowHoverId: string | null,
  setRowHoverId: React.Dispatch<SetStateAction<string | null>>,
  confirmDelete: string | null,
  setConfirmDelete: React.Dispatch<SetStateAction<string | null>>,
  confirmEdit: string | null,
  setConfirmEdit: React.Dispatch<SetStateAction<string | null>>
) => {
  //-- Build array --//
  let created_at = new Date(row.created_at);
  let currentRowDate = format(created_at, "EEE, MMM dd");

  //-- Compute sticky header text --//
  let stickyHeaderText = currentRowDate;
  if (isToday(created_at)) {
    stickyHeaderText += " - Today";
  } else if (isYesterday(created_at)) {
    stickyHeaderText += " - Yesterday";
  }

  //-- Format timestamps --//
  const formattedTime: string = created_at
    ? format(created_at, "h:mm aaa")
    : "";

  //-- Show sticky header for first item and when date changes --//
  let showStickyHeader: boolean = false;
  if (CC.conversationsArray) {
    showStickyHeader =
      index === 0 ||
      currentRowDate !==
        format(
          new Date(CC.conversationsArray[index - 1].created_at),
          "EEE, MMM dd"
        );
  }

  //-- Set conversationId --//
  const setConversationIdHandler = async (row: IConversation) => {
    CC.setConversationId(row._id);
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
    setConfirmDelete(row._id);
  };

  const confirmDeleteHandler = async (event: React.MouseEvent) => {
    event.stopPropagation();
    let accessToken = await getAccessTokenSilently();
    chatson.delete_conversation_and_messages(accessToken, row._id, CC);
  };

  return (
    <div>
      {/* Date Rows */}
      <>
        {showStickyHeader && (
          <div className="sticky top-0 bg-zinc-50 dark:bg-zinc-800">
            <div className="border-b-2 border-zinc-300 pb-1 pl-1 pt-1.5 text-sm font-bold text-zinc-700 dark:border-zinc-500 dark:text-zinc-200">
              <div className="flex flex-row">
                <CalendarDaysIcon className="mr-1 h-5 w-5" />
                {stickyHeaderText}
              </div>
            </div>
          </div>
        )}
      </>

      {/* Conversation Rows */}
      <div
        className={classNames(
          "rounded-md px-1.5 pb-1 pt-0.5",
          CC.conversationId === row._id
            ? "bg-zinc-300 dark:bg-zinc-600"
            : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
        )}
      >
        {/* Each row is a button for selecting that conversation */}
        <button
          onMouseEnter={mouseEnterHandler}
          onMouseLeave={mouseLeaveHandler}
          onClick={() => {
            setConversationIdHandler(row);
          }}
        >
          <div>
            {/* Title string */}
            <p
              className={classNames(
                "line-clamp-1 text-left text-sm font-semibold",
                CC.conversationId === row._id
                  ? "text-zinc-700 dark:text-zinc-200"
                  : "text-zinc-700 dark:text-zinc-300"
              )}
            >
              {row.title +
                "this is the title string for the a a a a convo. what happens when it's really long like this? What's clip do? "}
            </p>
          </div>

          {/* Delete, Edit, Request Count, and Time */}
          <div className="flex flex-row justify-end">
            <div className="flex flex-grow flex-row">
              {/* Conditionally render Delete and Edit Buttons based on hover state and CC */}
              {[rowHoverId, CC.conversationId].includes(row._id) &&
                !confirmDelete &&
                !confirmEdit && (
                  <>
                    {/* Delete Conversation Button */}
                    <TrashIcon
                      onClick={deleteConversationHandler}
                      className={classNames(
                        "mr-2 mt-0.5 h-4 w-4",
                        CC.conversationId === row._id
                          ? "text-zinc-500 hover:text-red-600 dark:text-zinc-400 hover:dark:text-red-600"
                          : "text-zinc-500 hover:text-red-600 dark:text-zinc-500 hover:dark:text-red-600"
                      )}
                    />

                    {/* Edit Title Button */}
                    <PencilSquareIcon
                      onClick={(event) => {
                        event.stopPropagation();
                        console.log("TODO - edit title");
                      }}
                      className={classNames(
                        "mt-0.5 h-4 w-4",
                        CC.conversationId === row._id
                          ? "text-zinc-500 hover:text-green-600 dark:text-zinc-400 hover:dark:text-green-600"
                          : "text-zinc-500 hover:text-green-600 dark:text-zinc-500 hover:dark:text-green-600"
                      )}
                    />
                  </>
                )}
              {confirmDelete === row._id && (
                <CheckIcon onClick={confirmDeleteHandler} className="h-4 w-4" />
              )}
            </div>

            {/* Request count */}
            <p
              className={classNames(
                "w-20 text-right text-sm font-semibold",
                CC.conversationId === row._id
                  ? "text-zinc-500 dark:text-zinc-400"
                  : "text-zinc-500 dark:text-zinc-500",
                row.api_req_res_metadata.length === 1 ? "mr-4" : "mr-2.5"
              )}
            >
              {row.api_req_res_metadata.length === 1
                ? `${row.api_req_res_metadata.length} request`
                : `${row.api_req_res_metadata.length} requests`}
            </p>

            {/* Time */}
            <p
              className={classNames(
                "w-16 text-sm font-semibold",
                CC.conversationId === row._id
                  ? "text-zinc-500 dark:text-zinc-400"
                  : "text-zinc-500 dark:text-zinc-500"
              )}
            >
              {formattedTime}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
