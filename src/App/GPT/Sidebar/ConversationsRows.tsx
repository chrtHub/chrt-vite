//-- react, react-router-dom, Auth0 --//
import { useState, useEffect, useCallback, Fragment, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//-- TSX Components and Functions --//
import { list_conversations } from "../chatson/Functions/list_conversations";
import { ConversationsRow } from "./ConversationsRow";
import { UpDownButton } from "./Buttons/UpDownButton";
import { getErrorDetails } from "../../../Errors/getErrorDetails";

//-- NPM Components --//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Popover, Transition } from "@headlessui/react";

//-- Icons --//
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftIcon,
  Cog8ToothIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

//-- NPM Functions --//
import { toast } from "react-toastify";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Environment Variables --//
import { useChatContext } from "../../../Context/ChatContext";

//-- NoSavedConversations --//
const NoSavedConversations = () => {
  return (
    <div className="mb-2 mt-0.5 flex h-full w-full flex-col items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
      <p className="font-semibold text-zinc-600 dark:text-zinc-300">
        No Saved Conversations
      </p>
      <ChatBubbleLeftIcon className="mt-2 h-20 w-20 text-zinc-200 dark:text-zinc-950" />
    </div>
  );
};

//-- Component --//
const Component = () => {
  //-- State --//
  const CC = useChatContext();
  const [rowHover, setRowHover] = useState<string | null>(null);
  const [activeDeleteRowId, setActiveDeleteRowId] = useState<string | null>(
    null
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaOnFocusToggle, setTextareaOnFocusToggle] =
    useState<boolean>(false);
  const [activeEditRowId, setActiveEditRowId] = useState<string | null>(null);
  const [newTitleDraft, setNewTitleDraft] = useState<string>("");
  const [retitleLoading, setRetitleLoading] = useState<boolean>(false);
  const [atBottom, setAtBottom] = useState<boolean>(false);
  const [atTop, setAtTop] = useState<boolean>(true);

  //-- Auth, react-router-dom, react-error-boundary --//
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary, resetBoundary } = useErrorBoundary();

  //-- Get conversations list on mount and if sortBy changes --//
  useEffect(() => {
    const getConversationsListHandler = async () => {
      let accessToken = await getAccessTokenSilently();
      try {
        await list_conversations(accessToken, CC, "overwrite");
      } catch (err) {
        if (err instanceof Error) {
          showBoundary(err);
        }
      }
    };
    getConversationsListHandler();
  }, [CC.sortBy]);

  //-- When textarea focuses, put cursor after the last char --//
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [textareaOnFocusToggle]);

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
    if (CC.conversationsArray) {
      let accessToken = await getAccessTokenSilently();
      try {
        await list_conversations(accessToken, CC, "append");
      } catch (err) {
        if (err instanceof Error) {
          toast(err.message);
        }
      }
    }
  }, [CC.conversationsArray]);

  //-- Before conversationsFetched, show skeleton --//
  if (!CC.conversationsFetched) {
    return (
      <div className="mb-2 mt-0.5 flex h-full w-full animate-pulse flex-col items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-900" />
    );
  }
  //-- Else if fetched, but no conversations returned --//
  else if (CC.conversationsFetched && CC.conversationsArray.length === 0) {
    return <NoSavedConversations />;
  } else {
    return (
      <>
        {/* Virtuoso Rows */}
        <Virtuoso
          id="virtuoso-conversations-list"
          ref={virtuosoRef}
          data={CC.conversationsArray}
          itemContent={(index, row) =>
            ConversationsRow(
              index,
              row,
              CC,
              getAccessTokenSilently,
              rowHover,
              setRowHover,
              activeDeleteRowId,
              setActiveDeleteRowId,
              textareaRef,
              setTextareaOnFocusToggle,
              activeEditRowId,
              setActiveEditRowId,
              newTitleDraft,
              setNewTitleDraft,
              retitleLoading,
              setRetitleLoading,
              navigate
            )
          } //-- Don't call hooks within this callback --//
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
          {/* DEV - settings button hidden for now */}
          {false && (
            <div className="mb-2 ml-1 mr-1.5 flex flex-col justify-center">
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
                    <div className="flex flex-col justify-center px-2 py-1">
                      {/* TODO - SETTINGS */}
                      <p>TODO - Settings, store in localStorage</p>
                      <p>[] Show Request Count</p>
                      <p>[] Show Time</p>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
          )}

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
    );
  }
};

//-- Fallback --//
const Fallback = ({ error }: { error: Error }) => {
  const {
    errorMessage,
    isAxiosError,
    axiosServerMessage,
    axiosHTTPStatus,
    axiosHTTPStatusText,
  } = getErrorDetails(error);

  const is401Error = axiosHTTPStatus === "401";

  if (is401Error) {
    return <NoSavedConversations />;
  } else {
    return (
      <div
        className={classNames(
          "mb-2 mt-0.5 flex h-full w-full flex-col items-center justify-center rounded-md bg-orange-100 p-3  text-center font-medium text-orange-800 dark:bg-amber-950 dark:text-orange-200"
        )}
      >
        {/* Non-401 errors */}
        {!is401Error && (
          <>
            <ExclamationTriangleIcon className="h-12 w-12 text-orange-400 opacity-40" />
            <>{errorMessage}</>
          </>
        )}
      </div>
    );
  }
};

export default function ConversationsRows() {
  //-- Component with ErrorBoundary and Fallback --//
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Component />
    </ErrorBoundary>
  );
}
