//-- react, react-router-dom, recoil, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";
import { useConversationsContext } from "../../../Context/ConversationsContext";

//-- TSX Components --//

//-- NPM Components --//
import { Virtuoso } from "react-virtuoso";
//-- Icons --//

//-- NPM Functions --//
import { format, formatDistanceToNow } from "date-fns";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Environment Variables --//
import { IConversationSerialized } from "../chatson/chatson_types";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

//-- Conversation Row --//
const ConversationRow = (props: { row: IConversationSerialized }) => {
  const { row } = props;
  const formattedDate: string = row.created_at
    ? format(new Date(row.created_at), "MMM dd, yyyy")
    : "-";
  const formattedTime: string = row.created_at
    ? format(new Date(row.created_at), "h:mm aaa")
    : "";
  const timeDistanceToNow = row.created_at
    ? formatDistanceToNow(new Date(row.created_at)) + " ago"
    : "-";
  return (
    <>
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
            <p className="line-clamp-1 text-sm text-left font-semibold text-zinc-700 dark:text-zinc-300">
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
    </>
  );
};

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ConversationsList() {
  const ConversationsContext = useConversationsContext();

  if (
    ConversationsContext.conversationsArray &&
    ConversationsContext.conversationsArray.length > 0
  ) {
    return (
      <>
        <div className="flex flex-row justify-center">
          {/* New conversation button */}
          <button
            type="button"
            className="mb-1.5 inline-flex w-full items-center gap-x-1.5 rounded-md bg-zinc-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 dark:hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
            onClick={() => {
              // TODO - start new conversation
              console.log("TODO - start new conversation");
            }}
          >
            <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            New Conversation
          </button>
        </div>

        {/* Virtuoso Rows */}
        <Virtuoso
          id="virtuoso-conversations-list"
          data={ConversationsContext.conversationsArray}
          itemContent={(index, row) => {
            return <ConversationRow row={row} />;
          }}
        />
      </>
    );
  }
  return null;
}
