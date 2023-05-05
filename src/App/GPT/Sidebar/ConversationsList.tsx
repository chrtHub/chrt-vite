//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useRef, MouseEventHandler, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useConversationsContext } from "../../../Context/ConversationsContext";

//-- TSX Components --//
import * as chatson from "../chatson/chatson";

//-- NPM Components --//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

//-- Icons --//
import {
  CalendarDaysIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
// import { PlusCircleIcon } from "@heroicons/react/24/solid";

//-- NPM Functions --//
import { produce } from "immer";
import { format, isToday, isYesterday } from "date-fns";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Environment Variables --//
import { IConversation } from "../chatson/chatson_types";
import { useChatContext } from "../../../Context/ChatContext";
import { ObjectId } from "bson";

//-- Conversation Button --//
interface ConversationButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler;
}
const ConversationButton: React.FC<ConversationButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        //-- Normal --//
        "mb-2 mt-1 inline-flex w-full items-center justify-center gap-x-1.5 rounded-md border-2 border-zinc-500 px-2.5 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm",
        //-- Hover --//
        "hover:border-green-600 hover:bg-green-600 hover:text-white",
        //-- Focus --//
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600",
        //-- Dark --//
        "dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-green-700 dark:hover:bg-green-700"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

//-- Styled Button --//
interface StyledButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler;
  frozen: boolean;
}
const StyledButton: React.FC<StyledButtonProps> = ({
  children,
  onClick,
  frozen,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        //-- Normal --//
        "mb-2 mt-0 inline-flex w-full items-center justify-center gap-x-1.5 rounded-md border-2 px-2.5 py-1 text-sm font-semibold  shadow-sm",
        //-- Hover --//
        frozen
          ? "cursor-not-allowed border-zinc-300 text-zinc-300 dark:text-zinc-600"
          : "border-zinc-600 text-zinc-600 hover:border-green-600 hover:bg-green-600 hover:text-white dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-green-700 dark:hover:bg-green-700",
        //-- Focus --//
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ConversationsList() {
  //-- State --//
  const CC = useChatContext();
  const ConversationsContext = useConversationsContext();
  const [atBottom, setAtBottom] = useState<boolean>(false);
  const [atTop, setAtTop] = useState<boolean>(true);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Virutoso --//
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const scrollToBottomHandler = () => {
    if (
      virtuosoRef.current &&
      ConversationsContext.conversationsArray &&
      ConversationsContext.conversationsArray.length > 0
    ) {
      virtuosoRef.current.scrollToIndex({
        index: ConversationsContext.conversationsArray.length, //-- not subtracting 1 cos it works without that --//
        behavior: "smooth",
        align: "end",
      });
    }
  };
  const scrollToTopHandler = () => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: 0,
        behavior: "smooth",
        align: "start",
      });
    }
  };

  //-- Get more conversations --//
  const getConversationsListHandler = async () => {
    let accessToken = await getAccessTokenSilently();
    let conversationsArrayLength = ConversationsContext.conversationsArray
      ? ConversationsContext.conversationsArray.length
      : 0;

    if (conversationsArrayLength > 0) {
      let list = await chatson.get_conversations_list(
        accessToken,
        conversationsArrayLength
      );

      ConversationsContext.setConversationsArray(
        produce(ConversationsContext.conversationsArray, (draft) => {
          if (draft && list) {
            draft.push(...list);
          } //-- else no mutation occurs --//
        })
      );
    }
  };

  //-- Set conversationId --//
  const setConversationIdHandler = async (row: IConversation) => {
    CC.setConversationId(row._id);
  };

  //-- Conversation Rows with Sticky Header Logic --//
  const ConversationRow = (index: number, row: IConversation) => {
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
                setConversationIdHandler(row);
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
              "border-t border-zinc-50 dark:border-zinc-800" // hidden - same bg as page
            )}
            aria-hidden="true"
          />
        </div>

        {/* New conversation button */}
        <div className="flex flex-row justify-center">
          <ConversationButton
            onClick={() => {
              console.log("TODO - start new conversation"); // TODO - start new conversation
            }}
          >
            <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
            New Conversation
          </ConversationButton>
        </div>

        {/*-- DIVIDER --*/}
        <div>
          <div
            className={classNames(
              "mb-0.5 mt-0.5 border-t border-zinc-50 dark:border-zinc-800" // hidden - same bg as page
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
            setAtBottom(isAtBottom);
          }}
          atTopStateChange={(isAtTop) => {
            setAtTop(isAtTop);
          }}
        />

        {/* Buttons - scroll to top/bottom, show more conversations */}
        <div className="mt-1.5 flex flex-row gap-2">
          {/* Scroll to top */}
          <StyledButton onClick={scrollToTopHandler} frozen={atTop}>
            <ChevronDoubleUpIcon className="h-5 w-5" aria-hidden="true" />
          </StyledButton>
          {atBottom ? (
            //-- Show more conversations --//
            <StyledButton frozen={false} onClick={getConversationsListHandler}>
              Show more
            </StyledButton>
          ) : (
            //-- Scroll to bottom --//
            <StyledButton onClick={scrollToBottomHandler} frozen={atBottom}>
              <ChevronDoubleDownIcon className="h-5 w-5" aria-hidden="true" />
            </StyledButton>
          )}
        </div>
      </div>
    );
  }
  return null;
}
