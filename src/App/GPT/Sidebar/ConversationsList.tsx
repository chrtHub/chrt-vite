//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//-- TSX Components --//
import * as chatson from "../chatson/chatson";
import { ConversationButton } from "./Buttons/ConversationButton";

//-- NPM Components --//

//-- Icons --//
import { PlusCircleIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Environment Variables --//
import { useChatContext } from "../../../Context/ChatContext";
import ConversationListRows from "./ConversationListRows";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ConversationsList() {
  //-- State --//
  const CC = useChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaOnFocusToggle, setTextareaOnFocusToggle] =
    useState<boolean>(false);

  //-- Auth, react-router-dom, react-error-boundary --//
  const navigate = useNavigate();

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

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex h-full flex-col">
      {/*-- DIVIDER --*/}
      <div className="mb-0.5 mt-1.5">
        <div
          className={classNames(
            "border-t-2 border-zinc-300 dark:border-zinc-500"
          )}
          aria-hidden="true"
        />
      </div>

      {/* 'New Conversation' Button, 'Sort By' Button Group */}
      <div className="mb-1.5 flex flex-col justify-center">
        {/* 'New Conversation' Button */}
        <ConversationButton
          onClick={() => {
            chatson.reset_conversation(CC, navigate);
          }}
        >
          <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
          New Conversation
        </ConversationButton>

        {/* 'Sort By' Button Group */}
        <div className="isolate inline-flex justify-center rounded-md shadow-sm">
          <button
            type="button"
            className={classNames(
              "relative inline-flex flex-grow items-center justify-center rounded-l-md border px-3 py-0.5 text-xs font-semibold focus:z-10",
              CC.sortBy === "last_edited"
                ? "border-zinc-400 bg-zinc-400 text-zinc-50 ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-600 dark:text-zinc-100"
                : "border-zinc-300 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
            )}
            onClick={() => {
              localStorage.setItem("sortBy", "last_edited");
              CC.setSortBy("last_edited");
            }}
          >
            Last Edited
          </button>
          <button
            type="button"
            className={classNames(
              "relative -ml-px inline-flex flex-grow items-center justify-center rounded-r-md border px-3 py-0.5 text-xs font-semibold focus:z-10",
              CC.sortBy === "created_at"
                ? "border-zinc-400 bg-zinc-400 text-zinc-50 ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-600 dark:text-zinc-100"
                : "border-zinc-300 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
            )}
            onClick={() => {
              localStorage.setItem("sortBy", "created_at");
              CC.setSortBy("created_at");
            }}
          >
            Created At
          </button>
        </div>
      </div>

      {/* Conversation List Rows */}
      <ConversationListRows />
    </div>
  );
}
