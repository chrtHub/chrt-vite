//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import * as chatson from "../chatson/chatson";
import { ConversationRow } from "./ConversationRow";
import { ConversationButton } from "./Buttons/ConversationButton";
import { StyledButton } from "./Buttons/StyledButton";

//-- NPM Components --//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

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
  const getConversationsListHandler = async () => {
    let accessToken = await getAccessTokenSilently();
    let conversationsArrayLength = CC.conversationsArray
      ? CC.conversationsArray.length
      : 0;

    if (conversationsArrayLength > 0) {
      let list = await chatson.list_conversations(
        accessToken,
        conversationsArrayLength
      );

      CC.setConversationsArray(
        produce(CC.conversationsArray, (draft) => {
          if (draft && list) {
            draft.push(...list);
          } //-- else no mutation occurs --//
        })
      );
    }
  };

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
          />

          {/* Buttons - scroll to top/bottom, show more conversations */}
          <div className="mt-1.5 flex flex-row gap-2">
            {/* Scroll to top */}
            <StyledButton onClick={scrollToTopHandler} frozen={atTop}>
              <ChevronDoubleUpIcon className="h-5 w-5" aria-hidden="true" />
            </StyledButton>
            {atBottom ? (
              //-- Show more conversations --//
              <StyledButton
                frozen={false}
                onClick={getConversationsListHandler}
              >
                Show more
              </StyledButton>
            ) : (
              //-- Scroll to bottom --//
              <StyledButton onClick={scrollToBottomHandler} frozen={atBottom}>
                <ChevronDoubleDownIcon className="h-5 w-5" aria-hidden="true" />
              </StyledButton>
            )}
          </div>
        </>
      )}
    </div>
  );
}
