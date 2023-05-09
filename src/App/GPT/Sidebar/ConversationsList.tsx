//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useCallback, Fragment, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import * as chatson from "../chatson/chatson";
import { ConversationRow } from "./ConversationRow";
import { ConversationButton } from "./Buttons/ConversationButton";
import { UpDownButton } from "./Buttons/UpDownButton";

//-- NPM Components --//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Popover, Transition } from "@headlessui/react";

//-- Icons --//
import {
  CalendarDaysIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//
import { produce } from "immer";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Environment Variables --//
import { IConversation } from "../chatson/chatson_types";
import { useChatContext } from "../../../Context/ChatContext";
import { Cog6ToothIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ConversationsList() {
  //-- State --//
  const CC = useChatContext();
  const [rowHover, setRowHover] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmEdit, setConfirmEdit] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState<boolean>(false);
  const [atTop, setAtTop] = useState<boolean>(true);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Virutoso --//
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const scrollToBottomHandler = () => {
    if (
      virtuosoRef.current &&
      CC.conversationsArray &&
      CC.conversationsArray.length > 0
    ) {
      virtuosoRef.current.scrollToIndex({
        index: CC.conversationsArray.length, //-- not subtracting 1 cos it works without that --//
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
  const listMoreConversations = useCallback(async () => {
    let accessToken = await getAccessTokenSilently();
    if (CC.conversationsArray) {
      await chatson.list_conversations(
        accessToken,
        CC,
        "append",
        CC.conversationsArray.length
      );
    }
  }, []);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
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
            chatson.reset_conversation(CC);
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

      {CC.conversationsArray && CC.conversationsArray.length > 0 && (
        <>
          {/* Virtuoso Rows */}
          <Virtuoso
            id="virtuoso-conversations-list"
            ref={virtuosoRef}
            data={CC.conversationsArray}
            itemContent={(index, row) =>
              ConversationRow(
                index,
                row,
                CC,
                getAccessTokenSilently,
                rowHover,
                setRowHover,
                confirmDelete,
                setConfirmDelete,
                confirmEdit,
                setConfirmEdit
              )
            } //-- Don't call hooks within this callback --//
            // itemContent={ConversationRow} // TESTING
            atBottomStateChange={(isAtBottom) => {
              setAtBottom(isAtBottom);
            }}
            atTopStateChange={(isAtTop) => {
              setAtTop(isAtTop);
            }}
            endReached={listMoreConversations}
          />

          {/* Buttons - scroll to top/bottom, show more conversations */}
          <div className="mt-1.5 flex flex-row gap-2">
            {/* Settings Button */}
            <div className="mb-2 ml-1 mr-1.5 flex flex-col justify-center">
              {/* DEV START */}
              <Popover as="div" className="relative inline-block text-left">
                <div>
                  <Popover.Button className="mx-2 flex items-center rounded-full align-middle text-zinc-600 hover:text-zinc-700 focus:outline-none dark:text-zinc-400 dark:hover:text-zinc-200">
                    <span className="sr-only">Conversations List Settings</span>
                    <Cog8ToothIcon className="h-5 w-5 text-zinc-700 hover:text-green-600 dark:text-zinc-200 dark:hover:text-green-600" />
                  </Popover.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Popover.Panel className="absolute bottom-full left-0 z-10 mb-3 ml-1 mt-2 w-52 rounded-md bg-white shadow-lg ring-1 ring-transparent ring-opacity-5 focus:outline-none dark:bg-zinc-900">
                    <div className="flex flex-col py-1">
                      {/* Sort By Buttons */}
                      <div className="isolate my-1 inline-flex justify-center rounded-md shadow-sm">
                        <button
                          type="button"
                          className={classNames(
                            "relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-zinc-300  focus:z-10",
                            CC.sortBy === "created_at"
                              ? "bg-zinc-300 text-zinc-800"
                              : "text-zinc-700 hover:bg-zinc-200"
                          )}
                          onClick={() => {
                            CC.setSortBy("created_at");
                          }}
                        >
                          Created At
                        </button>
                        <button
                          type="button"
                          className={classNames(
                            "relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-zinc-300 focus:z-10",
                            CC.sortBy === "last_edited"
                              ? "bg-zinc-300 text-zinc-800"
                              : "text-zinc-700 hover:bg-zinc-200"
                          )}
                          onClick={() => {
                            CC.setSortBy("last_edited");
                          }}
                        >
                          Last Edited
                        </button>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
              {/* DEV END */}
            </div>

            {/* Scroll to top */}
            <UpDownButton onClick={scrollToTopHandler} frozen={atTop}>
              <ChevronDoubleUpIcon className="h-5 w-5" aria-hidden="true" />
            </UpDownButton>

            {/* //-- Scroll to bottom --// */}
            <UpDownButton onClick={scrollToBottomHandler} frozen={atBottom}>
              <ChevronDoubleDownIcon className="h-5 w-5" aria-hidden="true" />
            </UpDownButton>
          </div>
        </>
      )}
    </div>
  );
}
