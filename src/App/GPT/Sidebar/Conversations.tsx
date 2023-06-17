//-- react, react-router-dom, Auth0 --//
import { useNavigate } from "react-router-dom";

//-- TSX Components and Functions --//
import { reset_conversation } from "../chatson/Functions/reset_conversation";
import { ConversationButton } from "./Buttons/ConversationButton";

//-- NPM Components --//

//-- Icons --//
import { PlusCircleIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Environment Variables --//
import { useChatContext } from "../../../Context/ChatContext";
import ConversationsRows from "./ConversationsRows";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Conversations() {
  //-- State --//
  const CC = useChatContext();

  //-- Auth, react-router-dom, react-error-boundary --//
  const navigate = useNavigate();

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex h-full flex-col">
      {/* 'New Conversation' Button, 'Sort By' Button Group */}
      <div className="mb-1.5 flex flex-col justify-center">
        {/* 'New Conversation' Button */}
        <ConversationButton
          onClick={() => {
            reset_conversation(CC, navigate);
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
                : "border-zinc-300 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
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
                : "border-zinc-300 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
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
      <ConversationsRows />
    </div>
  );
}
