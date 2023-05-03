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

//-- Conversation Row --//
const ConversationRow = (props: { row: IConversationSerialized }) => {
  const { row } = props;
  const formattedDate: string = row.created_at
    ? format(new Date(row.created_at), "MMM dd, yyyy")
    : "-";
  const formattedTime: string = row.created_at
    ? format(new Date(row.created_at), "hh:mm aaa")
    : "";
  const timeDistanceToNow = row.created_at
    ? formatDistanceToNow(new Date(row.created_at)) + " ago"
    : "-";
  return (
    <>
      <div className={classNames("rounded-md hover:bg-zinc-100")}>
        <p className="dark:text-zinc-200">
          {row.title + "this is the title string for the conversation..."}
        </p>
        <div className="flex flex-row justify-between">
          <p className="text-sm font-semibold text-zinc-500">
            {row.api_req_res_metadata.length === 1
              ? `${row.api_req_res_metadata.length} request`
              : `${row.api_req_res_metadata.length} requests`}
          </p>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-500">
            {formattedTime}
          </p>
        </div>
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
        <div className="flex flex-row">
          {/* New conversation button */}
          <button
            onClick={() => {
              console.log("NEW CONVO");
            }}
          >
            new conversation
          </button>
        </div>

        {/* Virtuoso */}
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
