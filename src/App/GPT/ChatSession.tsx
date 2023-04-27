//== react, react-router-dom, recoil, Auth0 ==//
import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useChatContext } from "../../Context/ChatContext";

//== TSX Components ==//
import ModelSelector from "./ModelSelector";
import * as chatson from "./chatson/chatson";

//== NPM Components ==//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

//== Icons ==//
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/20/solid";
//== NPM Functions ==//
import { produce } from "immer";

//== Utility Functions ==//
import { getUUIDV4 } from "../../Util/getUUIDV4";
import classNames from "../../Util/classNames";
import {
  ChevronDoubleDownIcon,
  CpuChipIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useIsMobile, useOSName } from "../../Util/useUserAgent";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IMessage, IMessageNode, IMessageRow } from "./chatson/chatson_types";
import { ObjectId } from "bson";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ChatSession() {
  //== React State (+ Context, Refs) ==//
  let CC = useChatContext();
  const [promptInput, setPromptInput] = useState<string>("");
  const [promptToSend, setPromptToSend] = useState<string>("");
  const [promptReadyToSend, setPromptReadyToSend] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaFocus, setTextAreaFocus] = useState<boolean>(true);

  //== Recoil State ==//

  //== Auth ==//
  const { getAccessTokenSilently, user } = useAuth0();

  //== Other ==//
  const OS_NAME = useOSName();

  //== Side Effects ==//
  useEffect(() => {
    if (promptReadyToSend) {
      //-- Refocus textarea after submitting a prompt (unless on mobile) --//
      let mobile = useIsMobile();
      if (textareaRef.current && !mobile) {
        textareaRef.current.focus();
      }

      const submitPrompt = async () => {
        const accessToken = await getAccessTokenSilently();

        //-- Send prompt as chat message --//
        if (user?.sub) {
          await chatson.send_message(accessToken, promptToSend);
          CC.setCompletionLoading(false);
        }
      };
      submitPrompt();

      setPromptReadyToSend(false);
    }
  }, [promptReadyToSend]);

  useEffect(() => {
    document.addEventListener("keydown", globalKeyDownHandler);
    return () => {
      document.removeEventListener("keydown", globalKeyDownHandler);
    };
  }, []);

  //== Event Handlers ==//

  //-- Submit prompt from textarea --//
  const submitPromptHandler = () => {
    //-- Update state and trigger prompt submission to occur afterwards as a side effect --//
    setPromptToSend(promptInput);
    setPromptInput("");
    CC.setCompletionLoading(true);
    setPromptReadyToSend(true);
  };

  //-- 'Enter' to submit prompt, 'Shift + Enter' for newline --//
  const keyDownHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); //-- Prevent default behavior (newline insertion) --//
      submitPromptHandler();
    } //-- else "Enter" with shift will just insert a newline --//
  };

  //-- Keyboard shortcut to focus prompt input textarea --//
  const globalKeyDownHandler = (event: KeyboardEvent) => {
    //-- Focus prompt input textarea (`metakey` = ⌘ on MacOS) --//
    if (OS_NAME === "Mac OS") {
      if (event.metaKey && event.key === "/") {
        event.preventDefault();
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }
    }
  };

  //-- Text area placeholder handlers and string --//
  const textareaFocusHandler = () => {
    setTextAreaFocus(true);
  };
  const textareaBlurHandler = () => {
    setTextAreaFocus(false);
  };
  const textareaPlaceholder = () => {
    let placeholder = "Input prompt...";

    if (!textAreaFocus && OS_NAME === "Mac OS") {
      placeholder = "⌘ +  /  to input prompt...";
    }

    return placeholder;
  };

  //-- ********************* --//
  //-- Message Node handlers --//
  let node_map: Record<string, IMessageNode> = {};

  //-- On updates to node array + leaf node (inside chatson.tsx) --//
  useEffect(() => {
    //-- Reset node_map --//
    node_map = {};

    //-- Build node_map --//
    if (CC.nodeArray) {
      CC.nodeArray.forEach((node) => {
        node_map[node._id.toString()] = node;
      });
    }

    //-- Call updateRowsArray --//
    CC.leafNodeIdString && updateRowsArray(CC.leafNodeIdString);
  }, [CC.nodeArray]);

  //-- On 'direct' updates to leaf node - via user selecting new conversation branch --//
  const versionChangeHandler = (
    node_id: ObjectId,
    sibling_node_ids: ObjectId[],
    increment: 1 | -1
  ) => {
    // for a prompt row, display prompt's "sibling_node_ids.indexOf(node_id) + 1 / sibling_node_ids.length", i.e. "1 / 3"

    //-- Current node --//
    let node_id_idx: number = sibling_node_ids.indexOf(node_id);
    //-- New version node --//
    let new_version_node_id: ObjectId =
      sibling_node_ids[node_id_idx + increment];
    let new_version_node: IMessageNode =
      node_map[new_version_node_id.toString()];
    //-- Find leaf node --//
    let new_leaf_node_id = findLeafNodeId(new_version_node);
    //-- Update leaf node state --//
    CC.setLeafNodeIdString((prevState) =>
      produce(prevState, (draft) => {
        draft = new_leaf_node_id.toString();
      })
    );
    //-- Call updateRowsArray --//
    updateRowsArray(new_leaf_node_id.toString());
  };

  function findLeafNodeId(node: IMessageNode): ObjectId {
    //-- Leaf node (only searching "1st child history") --//
    if (node.children_node_ids.length === 0) {
      return node._id;
    }
    //-- Not leaf node --//
    else {
      const first_child_node = node_map[node.children_node_ids[0].toString()];
      return findLeafNodeId(first_child_node);
    }
  }

  const [rowsArray, setRowsArray] = useState<IMessageRow[] | null>(null);

  //-- All leaf node updates lead to rebuilding rows_array --//
  const updateRowsArray = (newLeafNodeIdString: string) => {
    //-- initialize stuff --//
    let node: IMessageNode;
    let parent_node: IMessageNode;
    let new_rows_array: IMessageRow[] = [];

    //-- Start with new leaf node --//
    node = node_map[newLeafNodeIdString];

    //-- Loop until reaching the root node where parent_node_id is null --//
    while (node.parent_node_id) {
      parent_node = node_map[node.parent_node_id.toString()];

      //-- Sort parent's children by timestamp ascending --//
      let sibling_ids_timestamp_asc: ObjectId[] = [
        ...parent_node.children_node_ids.sort(
          (a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime()
        ),
      ];

      //-- Build completion row, add to new_rows_array --//
      let completion_row: IMessageRow;
      if (node.completion) {
        completion_row = {
          ...node.completion,
          node_id: node._id,
          sibling_node_ids: [], //-- Use prompt_row for this --//
        };
        new_rows_array.push(completion_row);
      }

      //-- Build prompt row, add to new_rows_array --//
      let prompt_row: IMessageRow = {
        ...node.prompt,
        node_id: node._id,
        sibling_node_ids: [...sibling_ids_timestamp_asc],
      };
      new_rows_array.push(prompt_row);

      //-- Update node --//
      node = parent_node;
    }

    //-- Update state --//
    setRowsArray((rowsArray) => {
      new_rows_array = new_rows_array.reverse(); //-- push + reverse --//
      return produce(rowsArray, (draft) => {
        draft = new_rows_array;
      });
    });
  };

  //-- ***** ***** ***** Start of Message Rows Component **** ***** ***** --//
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const [atBottom, setAtBottom] = useState<boolean>(true);
  const [showButton, setShowButton] = useState<boolean>(false);

  //-- When 'atBottom' changes - if at bottom don't show button, else show button --//
  useEffect(() => {
    if (atBottom) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  }, [atBottom, setShowButton]);

  // const scrollToBottomHandler = () => {
  //   // visibleThread.length > 0
  //   if (virtuosoRef.current && filteredMessages.length > 0) {
  //     virtuosoRef.current.scrollToIndex({
  //       index: filteredMessages.length - 1, // visibleThread.length
  //       behavior: "smooth",
  //       align: "end",
  //     });
  //   }
  // };

  //-- Message Row Author --//
  const Author = (props: { message: IMessage }) => {
    let { message } = props;

    //-- If author is the current user, display their profile photo --//
    if (message.author === user?.sub) {
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
    if (message.author === message.model.api_name) {
      return (
        <div className="flex flex-col items-center">
          <CpuChipIcon className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {message.model.friendly_name}
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
  const MessageData = (props: { message: IMessage }) => {
    let { message } = props;

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
  const VersionSelector = (props: { message: IMessage }) => {
    let { message } = props;

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

  //-- Message Row Component --//
  const Row = (props: { row: IMessageRow }) => {
    const { node } = props;
    return (
      <div
        id="chat-row"
        className={classNames(
          message.role === "user"
            ? "rounded-lg bg-zinc-200 dark:bg-zinc-900"
            : "",
          "w-full justify-center lg:flex"
        )}
      >
        {/* Mobile Row Top - visible until 'lg' */}
        <div className="lg:hidden">
          <div className="flex flex-row items-center justify-center py-2 pl-2 pr-2">
            <MessageData message={message} />
            <div className="ml-auto">
              <Author message={message} />
            </div>
          </div>
        </div>

        {/* Author - visible for 'lg' and larger */}
        <div
          id="chat-author-content"
          className="my-3.5 hidden w-full flex-col items-center justify-start lg:flex lg:w-24"
        >
          <Author message={message} />
        </div>

        {/* MESSAGE - always visible */}
        <div
          id="chat-message"
          className="mx-auto flex w-full max-w-prose lg:mx-0"
        >
          <article className="prose prose-zinc w-full max-w-prose dark:prose-invert dark:text-white max-lg:pl-2.5">
            <li key={message.message_uuid}>
              <ReactMarkdown
                children={message.message}
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
            <MessageData message={message} />
            <VersionSelector message={message} />
          </div>
        </div>
      </div>
    );
  };
  //-- ***** ***** ***** End of Message Rows Component **** ***** ***** --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div id="chat-session-tld" className="flex max-h-full min-h-full flex-col">
      {/* CURRENT CHAT or SAMPLE PROPMTS */}
      {rows_array.length > 0 ? (
        <div id="llm-current-chat" className="flex flex-grow">
          <div id="chat-rows" className="w-full list-none">
            {/*-- Similar implemenatation to https://virtuoso.dev/stick-to-bottom/ --*/}
            <Virtuoso
              ref={virtuosoRef}
              data={rows_array}
              itemContent={(index, row) => <Row key={row.TODO} row={row} />}
              followOutput="smooth"
              atBottomStateChange={(isAtBottom) => {
                setAtBottom(isAtBottom);
              }}
            />
          </div>
        </div>
      ) : (
        //-- Landing view for null conversation --//
        <div
          id="llm-sample-prompts"
          className="flex flex-grow flex-col items-center justify-center"
        >
          <p className="font-sans text-4xl font-semibold text-zinc-700 dark:text-zinc-200">
            ChrtGPT
          </p>
          <article className="prose prose-zinc dark:prose-invert">
            <div className="mb-0 flex flex-col">
              <p className="mb-0 mt-2.5 font-sans font-medium italic">
                What is ChrtGPT?
              </p>
              <p className="mb-0 mt-1.5 font-sans font-medium italic">
                How to be a good day trader?
              </p>
              <p className="mb-0 mt-1.5 font-sans font-medium italic">
                What are some risks of day trading?
              </p>
            </div>
          </article>
        </div>
      )}

      {/* STICKY INPUT SECTION */}
      <div className="sticky bottom-0 flex h-auto flex-col justify-center bg-zinc-50 pb-3 pt-1 dark:bg-zinc-800">
        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="mb-2 w-full max-w-prose border-t-2 border-zinc-300 dark:border-zinc-600"></div>
        </div>

        {/* CONTROL BAR */}
        <div className="flex justify-center">
          <div
            id="chat-session-control-bar"
            className="flex w-full max-w-prose flex-row"
          >
            {/* Stop Response Generation */}
            <div className="flex w-full flex-row items-center justify-center">
              {/* DEV - always 'false' for now, when streaming in use, add logic here to allow user to stop response generation */}
              {false && CC.completionLoading && (
                <>
                  <button
                    onClick={() => console.log("cancel")} // TODO - add logic
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-zinc-600 px-2.5 py-1.5 font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                  >
                    <XCircleIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    <p className="text-sm">Cancel</p>
                  </button>
                </>
              )}
            </div>

            {/* Select LLM Model */}
            <div className="flex w-full items-center justify-center">
              <ModelSelector />
            </div>

            {/* Scroll to Bottom */}
            <div className="flex w-full items-center justify-end">
              <button
                className="pr-1.5"
                disabled={!showButton}
                // onClick={scrollToBottomHandler}
              >
                <ChevronDoubleDownIcon
                  className={classNames(
                    showButton
                      ? "cursor-pointer text-zinc-900 dark:text-zinc-100"
                      : "cursor-not-allowed text-zinc-400 dark:text-zinc-500",
                    "h-6 w-6"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* PROMPT INPUT */}
        <div>
          <div
            id="llm-prompt-input"
            className="mb-2 flex justify-center align-bottom lg:mb-4"
          >
            <label htmlFor="prompt-input" className="sr-only">
              Prompt Input
            </label>
            <div className="relative mt-2 w-full max-w-prose rounded-md shadow-md">
              <TextareaAutosize
                autoFocus
                ref={textareaRef}
                maxRows={10}
                id="prompt-input"
                name="prompt-input"
                placeholder={textareaPlaceholder()}
                onFocus={textareaFocusHandler}
                onBlur={textareaBlurHandler}
                wrap="hard"
                value={promptInput}
                onKeyDown={keyDownHandler}
                onChange={(event) => setPromptInput(event.target.value)}
                className={classNames(
                  CC.completionLoading ? "bg-zinc-300 ring-2" : "",
                  "block w-full resize-none rounded-md border-0 bg-white py-1.5 pr-10 text-base text-zinc-900 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-green-600 dark:bg-zinc-700 dark:text-white sm:leading-6"
                )}
              />

              {CC.completionLoading ? (
                <button className="absolute bottom-0 right-0 flex cursor-wait items-center p-1.5 focus:outline-green-600">
                  <CpuChipIcon className="text h-6 w-6 animate-spin text-green-500" />
                </button>
              ) : (
                <button
                  id="submit-prompt-button"
                  onClick={submitPromptHandler}
                  disabled={!promptInput}
                  className={classNames(
                    !promptInput ? "cursor-not-allowed" : "cursor-pointer",
                    "absolute bottom-0 right-0 flex items-center p-1.5 focus:outline-green-600"
                  )}
                >
                  <ArrowUpCircleIcon
                    className={classNames(
                      promptInput ? "text-green-600" : "text-zinc-300",
                      "h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
