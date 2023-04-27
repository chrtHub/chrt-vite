//== react, react-router-dom, recoil, Auth0 ==//
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components ==//

//== NPM Components ==//
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

//== Icons ==//
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { CpuChipIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IMessageRow } from "./chatson/chatson_types";

export default function ChatRow(props: { row: IMessageRow }) {
  let { row } = props;
  const { user } = useAuth0();

  const Author = () => {
    //-- If author is the current user, display their profile photo --//
    if (row.author === user?.sub) {
      if (user?.picture) {
        return (
          <img
            src={user?.picture}
            alt={user?.name}
            className="h-10 w-10 rounded-full"
          />
        );
      } else {
        <div>{user.name}</div>;
      }
    }

    //-- If author is a model, display name of the model --//
    if (row.author === row.model.api_name) {
      return (
        <div className="flex flex-col items-center">
          <CpuChipIcon className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {row.model.friendly_name}
          </div>
        </div>
      );
    }

    return (
      // TODO - implement logic to show initials or perhaps photo in mulit-user chats(?)
      <div>human</div>
    );
  };

  //-- Message Row MessageData --//
  const RowData = () => {
    // let friendlyDate = format(date, "hh:mm:ss");
    // let friendlyDate = new Intl.DateTimeFormat("en-US", {
    //   hour: "numeric",
    //   minute: "2-digit",
    //   second: "2-digit",
    // }).format(message.created_at);

    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {/* TODO - implement new metatdata ui for rows */}
        {/* {friendlyDate} */}
      </div>
    );
  };

  //-- Version Selector --//
  const VersionSelector = () => {
    return (
      <div className="flex flex-row">
        <ChevronLeftIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        <p className="text-zinc-400">1/2</p>
        <ChevronRightIcon
          className="h-5 w-5 text-zinc-400"
          aria-hidden="true"
        />
      </div>
    );
  };

  return (
    <div
      id="chat-row"
      className={classNames(
        row.role === "user" ? "rounded-lg bg-zinc-200 dark:bg-zinc-900" : "",
        "w-full justify-center lg:flex"
      )}
    >
      {/* Mobile Row Top - visible until 'lg' */}
      <div className="lg:hidden">
        <div className="flex flex-row items-center justify-center py-2 pl-2 pr-2">
          <RowData />
          <div className="ml-auto">
            <Author />
          </div>
        </div>
      </div>

      {/* Author - visible for 'lg' and larger */}
      <div
        id="chat-author-content"
        className="my-3.5 hidden w-full flex-col items-center justify-start lg:flex lg:w-24"
      >
        <Author />
      </div>

      {/* MESSAGE - always visible */}
      <div
        id="chat-message"
        className="mx-auto flex w-full max-w-prose lg:mx-0"
      >
        <article className="prose prose-zinc w-full max-w-prose dark:prose-invert dark:text-white max-lg:pl-2.5">
          <li key={row.role}>
            <ReactMarkdown
              children={row.content}
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, children }) => (
                  <p className="max-lg:m-0 max-lg:p-0 max-lg:pb-2">
                    {children}
                  </p>
                ),
              }}
            />
          </li>
        </article>
      </div>

      {/* MessageData - visible for 'lg' and larger */}
      <div
        id="chat-MessageData-content-lg"
        className="mt-5 hidden w-full flex-col pr-2 lg:flex lg:w-24"
      >
        <div className="flex flex-row justify-end">
          <RowData />
          <VersionSelector />
        </div>
      </div>
    </div>
  );
}
