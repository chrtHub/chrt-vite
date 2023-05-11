//== react, react-router-dom, recoil, Auth0 ==//
import { useChatContext } from "../../Context/ChatContext";
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components ==//

//== NPM Components ==//
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

//== Icons ==//
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ClipboardDocumentIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

//== NPM Functions ==//
import { useCopyToClipboard } from "usehooks-ts";

//== Utility Functions ==//
import classNames from "../../Util/classNames";
import getFriendly from "./chatson/getFriendly";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IMessageRow } from "./chatson/chatson_types";

//-- Exported Component --//
export default function ChatRow(props: { row: IMessageRow }) {
  let { row } = props;
  let CC = useChatContext();
  const { user } = useAuth0();
  const [clipboardValue, copyToClipboard] = useCopyToClipboard();

  const CopyToClipboardButton = () => {
    return (
      <div className="flex flex-row justify-center">
        <button
          onClick={() => {
            copyToClipboard(row.content);
          }}
        >
          <ClipboardDocumentIcon
            className="h-6 w-6 rounded-md text-zinc-400 dark:hover:bg-zinc-500 dark:hover:text-zinc-100"
            aria-hidden="true"
          />
        </button>
      </div>
    );
  };

  const Author = ({ mobile }: { mobile: boolean }) => {
    //-- If author is the current user, display their profile photo --//
    if (row.author === user?.sub) {
      if (user?.picture) {
        return (
          <div
            className={classNames(
              mobile
                ? "flex w-14 flex-col items-center"
                : "flex w-16 flex-col items-center"
            )}
          >
            <img
              src={user?.picture}
              alt={user?.name}
              className={classNames(
                mobile ? "h-8 w-8 rounded-full" : "h-10 w-10 rounded-full"
              )}
            />
          </div>
        );
      } else {
        <div
          className={classNames(
            mobile
              ? "flex w-14 flex-col items-center"
              : "flex w-16 flex-col items-center"
          )}
        >
          {user.name}
        </div>;
      }
    }

    //-- If author is a model, display name of the model --//
    if (row.author === row.model.model_api_name) {
      return (
        <div
          className={classNames(
            mobile
              ? "flex w-14 flex-col items-center"
              : "flex w-16 flex-col items-center"
          )}
        >
          <CpuChipIcon className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {getFriendly(
              row.model.model_api_name,
              CC.model_friendly_names,
              "model_friendly_name"
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className={classNames(
          mobile
            ? "flex w-14 flex-col items-center"
            : "flex w-16 flex-col items-center"
        )}
      >
        <CpuChipIcon
          className={classNames(
            mobile
              ? "mt-1 h-8 w-8 text-zinc-500 dark:text-zinc-400"
              : "mt-1 h-8 w-8 text-zinc-500 dark:text-zinc-400"
          )}
        />
      </div>
    );
  };

  //-- Message Row MessageData --//
  const RowData = () => {
    let friendlyDate = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      // second: "2-digit",
    }).format(new Date(row.created_at));

    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {friendlyDate}
      </div>
    );
  };

  //-- Version Selector --//
  const VersionSelector = () => {
    return (
      <div className="my-1 flex flex-row">
        <button
          className="flex flex-col justify-end pb-0.5"
          onClick={() => {
            console.log("todo - change branch");
          }}
        >
          <ChevronLeftIcon
            className="h-4 w-4 rounded-full text-zinc-400 dark:hover:bg-zinc-500 dark:hover:text-zinc-100"
            aria-hidden="true"
          />
        </button>

        <p className="text-sm text-zinc-400">
          {`1`} / {`2`}
        </p>

        <button
          className="flex flex-col justify-end pb-0.5"
          onClick={() => {
            console.log("todo - change branch");
          }}
        >
          <ChevronRightIcon
            className="h-4 w-4 rounded-full text-zinc-400 dark:hover:bg-zinc-500 dark:hover:text-zinc-100"
            aria-hidden="true"
          />
        </button>
      </div>
    );
  };

  return (
    <div
      id="chat-row"
      className={classNames(
        row.role === "user"
          ? "rounded-lg bg-zinc-200 dark:bg-zinc-900"
          : "rounded-lg bg-zinc-50 dark:bg-zinc-800",
        "w-full justify-center lg:flex"
      )}
    >
      {/* Mobile Row Top - visible until 'lg' */}
      <div className="lg:hidden">
        <div className="flex flex-row items-center justify-between py-2 pl-2 pr-2">
          <Author mobile={true} />
          <VersionSelector />

          <CopyToClipboardButton />
          <RowData />
        </div>
      </div>

      {/* Author - visible for 'lg' and larger */}
      <div
        id="chat-author-content"
        className="my-3.5 hidden w-full flex-col items-center justify-start lg:flex lg:w-24"
      >
        <Author mobile={false} />
        <VersionSelector />
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
        <div className="flex flex-col justify-end">
          <RowData />
          <CopyToClipboardButton />
        </div>
      </div>
    </div>
  );
}
