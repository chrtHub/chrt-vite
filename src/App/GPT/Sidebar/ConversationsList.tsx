//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useConversationsContext } from "../../../Context/ConversationsContext";

//-- TSX Components --//

//-- NPM Components --//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

//-- Icons --//
import {
  ArrowDownCircleIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
// import { PlusCircleIcon } from "@heroicons/react/24/solid";

//-- NPM Functions --//
import { format, isToday, isYesterday } from "date-fns";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Environment Variables --//
import { IConversationSerialized } from "../chatson/chatson_types";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ConversationsList() {
  //-- State --//
  const ConversationsContext = useConversationsContext();
  const [atBottom, setAtBottom] = useState<boolean>(false);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const scrollToBottomHandler = () => {
    if (
      virtuosoRef.current &&
      ConversationsContext.conversationsArray &&
      ConversationsContext.conversationsArray.length > 0
    ) {
      virtuosoRef.current.scrollToIndex({
        index: ConversationsContext.conversationsArray.length - 1, //-- e.g. visible conversations list length --//
        behavior: "smooth",
        align: "end",
      });
    }
  };

  //-- Conversation Rows with Sticky Header Logic --//
  const ConversationRow = (index: number, row: IConversationSerialized) => {
    if (
      ConversationsContext.conversationsArray &&
      ConversationsContext.conversationsArray.length > 0
    ) {
      //-- Get date of current row --//
      let rowCreatedAt = new Date(row.created_at);
      let currentRowDate = format(rowCreatedAt, "EEE, MMM dd");

      //-- Compute sticky header text --//
      let stickyHeaderText = currentRowDate;
      if (isToday(rowCreatedAt)) {
        stickyHeaderText += " - Today";
      } else if (isYesterday(rowCreatedAt)) {
        stickyHeaderText += " - Yesterday";
      }

      //-- Format timestamps --//
      const formattedTime: string = row.created_at
        ? format(rowCreatedAt, "h:mm aaa")
        : "";

      //-- Show sticky header for first item and when date changes --//
      const showStickyHeader =
        index === 0 ||
        currentRowDate !==
          format(
            new Date(
              ConversationsContext.conversationsArray[index - 1].created_at
            ),
            "EEE, MMM dd"
          );

      return (
        <div>
          {/* Sticky header date */}
          {showStickyHeader && (
            <div className="sticky top-0 bg-zinc-50 dark:bg-zinc-800">
              <div className="my-1 border-b-2 border-zinc-300 pb-1 pl-1 pt-1.5 text-sm font-bold text-zinc-700 dark:border-zinc-500 dark:text-zinc-200">
                <div className="flex flex-row">
                  <CalendarDaysIcon className="mr-1 h-5 w-5" />
                  {stickyHeaderText}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md px-1.5 pb-1 pt-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700">
            {/* Each row is a button for selecting that conversation */}
            <button
              onClick={() => {
                // TODO - request conversation, set it in state
                console.log(`TODO - request conversation: ${row._id}`); // DEV
              }}
            >
              <div className="">
                {/* Title string */}
                <p className="line-clamp-1 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {row.title +
                    "this is the title string for the conversation. what happens when it's really long like this? What's clip do? "}
                </p>
              </div>

              {/* Request Count and Time */}
              <div className="flex flex-row justify-between">
                {/* Request count */}
                <p className="text-sm font-semibold text-zinc-500">
                  {row.api_req_res_metadata.length === 1
                    ? `${row.api_req_res_metadata.length} request`
                    : `${row.api_req_res_metadata.length} requests`}
                </p>
                {/* Time */}
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-500">
                  {formattedTime}
                </p>
              </div>
            </button>
          </div>
        </div>
      );
    }
  };

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  if (
    ConversationsContext.conversationsArray &&
    ConversationsContext.conversationsArray.length > 0
  ) {
    return (
      <div className="flex h-full flex-col">
        {/*-- DIVIDER --*/}
        <div className="mb-1.5 mt-1.5">
          <div
            className={classNames(
              "border-t border-zinc-300 dark:border-zinc-500"
            )}
            aria-hidden="true"
          />
        </div>

        {/* New conversation button */}
        <div className="flex flex-row justify-center">
          <button
            type="button"
            className={classNames(
              //-- Normal --//
              "inline-flex w-full items-center gap-x-1.5 rounded-md border-2 border-zinc-500 px-2.5 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm",
              //-- Hover --//
              "hover:border-green-600 hover:bg-green-600 hover:text-white",
              //-- Focus --//
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600",
              //-- Dark --//
              "dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-green-700 dark:hover:bg-green-700"
            )}
            onClick={() => {
              console.log("TODO - start new conversation"); // TODO - start new conversation
            }}
          >
            <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
            New Conversation
          </button>
        </div>

        {/*-- DIVIDER --*/}
        <div className="">
          <div
            className={classNames(
              //-- 2nd divider mb of 0.5 + sticky row my-1 = 1.5 --//
              "mb-0.5 mt-1.5 border-t border-zinc-300 dark:border-zinc-500"
            )}
            aria-hidden="true"
          />
        </div>

        {/* Virtuoso Rows */}
        <Virtuoso
          id="virtuoso-conversations-list"
          ref={virtuosoRef}
          data={ConversationsContext.conversationsArray}
          itemContent={(index, row) => ConversationRow(index, row)} //-- Don't call hooks within this callback --//
          atBottomStateChange={(isAtBottom) => {
            console.log("isAtBottom: ", isAtBottom); // DEV
            setAtBottom(isAtBottom);
          }}
        />

        {atBottom ? (
          //-- Load more conversations button --//
          <div className="flex flex-row justify-center">
            <button
              type="button"
              className={classNames(
                //-- Normal --//
                "mt-1 inline-flex w-full items-center gap-x-1.5 rounded-md border-2 border-zinc-500 px-2.5 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm",
                //-- Hover --//
                "hover:border-green-600 hover:bg-green-600 hover:text-white",
                //-- Focus --//
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600",
                //-- Dark --//
                "dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-green-700 dark:hover:bg-green-700"
              )}
              onClick={() => {
                console.log("TODO - load more conversations"); // TODO - load more conversations
              }}
            >
              <ArrowDownCircleIcon className="h-5 w-5" aria-hidden="true" />
              Load more
            </button>
          </div>
        ) : (
          //-- Scroll to bottom button --//
          <div className="flex flex-row justify-center">
            <button
              type="button"
              className={classNames(
                //-- Normal --//
                "mt-1 inline-flex w-full items-center gap-x-1.5 rounded-md border-2 border-zinc-500 px-2.5 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm",
                //-- Hover --//
                "hover:border-green-600 hover:bg-green-600 hover:text-white",
                //-- Focus --//
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600",
                //-- Dark --//
                "dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-green-700 dark:hover:bg-green-700"
              )}
              onClick={() => {
                console.log("TODO - scroll to bottom"); // TODO - load more conversations
                scrollToBottomHandler();
              }}
            >
              <ArrowDownCircleIcon className="h-5 w-5" aria-hidden="true" />
              Scroll to bottom
            </button>
          </div>
        )}
      </div>
    );
  }
  return null;
}
