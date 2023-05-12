//== react, react-router-dom, recoil, Auth0 ==//
import { useState, useEffect, useRef } from "react";
import { useChatContext } from "../../Context/ChatContext";
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components ==//
import * as chatson from "./chatson/chatson";

//== NPM Components ==//
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TextareaAutosize from "react-textarea-autosize";

//== Icons ==//
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  CpuChipIcon,
  PencilSquareIcon,
  XCircleIcon,
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
  const { getAccessTokenSilently, user } = useAuth0();
  const [clipboardValue, copyToClipboard] = useCopyToClipboard();

  //-- chatson.change_branch() --//
  const changeBranchHandler = (increment: number) => {
    const node_index = row.sibling_node_ids.indexOf(row.node_id);
    const new_leaf_node_id = row.sibling_node_ids[node_index + increment];
    chatson.change_branch(new_leaf_node_id, CC);
  };

  //-- Edit prompt --//
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaOnFocusToggle, setTextareaOnFocusToggle] =
    useState<boolean>(false);
  const [promptContent, setPromptContent] = useState<string>(row.content);
  const [editing, setEditing] = useState<boolean>(false);
  const EditButton = () => {
    return (
      <div
        className={classNames(
          "flex flex-row justify-center rounded-full p-1 text-zinc-600 dark:text-zinc-300",
          editing
            ? "bg-green-300 text-green-900 dark:bg-green-800 dark:text-green-200"
            : "dark:hover:bg-text-200 hover:bg-zinc-300 hover:text-zinc-600 dark:hover:bg-zinc-700"
        )}
      >
        <button
          onClick={() => {
            setEditing(true);
          }}
        >
          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    );
  };
  //-- 'Enter' w/o 'Shift' to submit prompt, 'Shift + Enter' for newline --//
  const keyDownHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); //-- Prevent default behavior (newline insertion) --//
      textareaRef.current?.blur();
      submitEditedPrompt();
      // TODO - prevent submit if loading new completion?
    } //-- else "Enter" with shift will just insert a newline --//
  };
  //-- Submit edited prompt, create new branch --//
  const submitEditedPrompt = async () => {
    console.log("todo - sumbit edited prompt, create new branch");
    const accessToken = await getAccessTokenSilently();

    //-- Send prompt as chat message --//
    await chatson.send_message(
      accessToken,
      promptContent,
      row.parent_node_id,
      CC
    );
  };
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

  //-- Copy to Clipboard --//
  const [copying, setCopied] = useState<boolean>(false);
  const CopyToClipboardButton = () => {
    return (
      <div
        className={classNames(
          "flex flex-row justify-center rounded-full p-1 text-zinc-600 dark:text-zinc-300",
          copying
            ? "bg-green-300 text-green-900 dark:bg-green-800 dark:text-green-200"
            : "dark:hover:bg-text-200 hover:bg-zinc-300 hover:text-zinc-700 dark:hover:bg-zinc-700"
        )}
      >
        <button
          onClick={() => {
            copyToClipboard(row.content);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 750);
          }}
        >
          <ClipboardDocumentIcon className="h-6 w-6" aria-hidden="true" />
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
  const Timestamp = () => {
    let friendlyDate = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      // second: "2-digit",
    }).format(new Date(row.created_at));

    return (
      <div
        className={classNames(
          "flex flex-row justify-center text-sm",
          hover
            ? "text-zinc-600 dark:text-zinc-300"
            : "text-zinc-500 dark:text-zinc-400"
        )}
      >
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
            changeBranchHandler(-1);
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
            changeBranchHandler(1);
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

  //-- Track row hover state --//
  const [hover, setHover] = useState<boolean>(false);
  const mouseEnterHandler = () => {
    setHover(true);
  };
  const mouseLeaveHandler = () => {
    setHover(false);
  };

  return (
    <div
      id="chat-row"
      className={classNames(
        row.role === "user" ? "" : "rounded-md bg-zinc-200 dark:bg-zinc-900",
        "w-full justify-center lg:flex"
      )}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      {/* Mobile Row Top - visible until 'lg' */}
      <div className="lg:hidden">
        <div className="flex flex-row items-center justify-between py-2 pl-2 pr-2">
          <Author mobile={true} />
          {row.prompt_or_completion === "prompt" && <VersionSelector />}
          {row.prompt_or_completion === "prompt" && <EditButton />}
          <CopyToClipboardButton />
          <Timestamp />
        </div>
      </div>

      {/* Author - visible for 'lg' and larger */}
      <div
        id="chat-author-content"
        className="my-3.5 hidden w-full flex-col items-center justify-start lg:flex lg:w-24"
      >
        <Author mobile={false} />
        {row.prompt_or_completion === "prompt" && <VersionSelector />}
      </div>

      {/* MESSAGE - always visible */}
      <div
        id="chat-message"
        className="mx-auto flex w-full max-w-prose lg:mx-0"
      >
        <article className="prose prose-zinc w-full max-w-prose dark:prose-invert dark:text-white max-lg:pl-2.5">
          {editing ? (
            <TextareaAutosize
              autoFocus
              onFocus={() =>
                setTextareaOnFocusToggle((prevState) => !prevState)
              }
              ref={textareaRef}
              value={promptContent}
              maxRows={42} //-- arbitrary number --//
              onChange={(event) => setPromptContent(event.target.value)}
              onKeyDown={keyDownHandler}
              // onBlur={() => setEditing(false)}
              className={classNames(
                "mb-2 mt-5 block w-full resize-none rounded-md border-0 bg-white px-0 py-0 text-zinc-900 ring-2 ring-green-600 focus:ring-2 focus:ring-green-600 dark:bg-zinc-700 dark:text-zinc-100"
              )}
            />
          ) : (
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
          )}
        </article>
      </div>

      {/* MessageData - visible for 'lg' and larger */}
      <div
        id="chat-MessageData-content-lg"
        className="mt-5 hidden w-full flex-col pr-2 lg:flex lg:w-24"
      >
        <div className="flex flex-col justify-end">
          <Timestamp />
          <div className="flex flex-row justify-center">
            {hover && !editing && (
              <>
                {row.prompt_or_completion === "prompt" && <EditButton />}
                <CopyToClipboardButton />
              </>
            )}
            {editing && (
              <>
                <XCircleIcon
                  onClick={() => {
                    setEditing(false);
                  }}
                  className="ml-1 h-6 w-6 cursor-pointer rounded-full text-indigo-500 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400"
                />
                <CheckCircleIcon
                  onClick={() => {
                    submitEditedPrompt();
                    setEditing(false);
                  }}
                  className="mx-1 h-6 w-6 cursor-pointer rounded-full text-indigo-500 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
