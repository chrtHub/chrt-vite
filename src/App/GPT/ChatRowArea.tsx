//== react, react-router-dom, recoil, Auth0 ==//
import { useEffect } from "react";
import { useChatContext } from "../../Context/ChatContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import ChatRow from "./ChatRow";
import ChatLanding from "./ChatLanding";
import { getPermissions } from "../../Auth/getPermissions";
import { throwAxiosError } from "../../Errors/throwAxiosError";

//== NPM Components ==//
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//-- Exported Component --//
interface IProps {
  virtuosoRef: React.MutableRefObject<VirtuosoHandle | null>;
  setAtBottom: React.Dispatch<React.SetStateAction<boolean>>;
  chatToast: (message: string) => void;
}
export default function ChatRowArea({
  virtuosoRef,
  setAtBottom,
  chatToast,
}: IProps) {
  let CC = useChatContext();
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  //-- On mount, check if accessToken permissions include "chat:llm" --//
  const lambda = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const permissions = await getPermissions(accessToken);
      if (!permissions.includes("chat:llm")) {
        throwAxiosError(401);
      }
    } catch (err) {
      showBoundary(err);
    }
  };
  useEffect(() => {
    lambda();
  }, []);

  return (
    <>
      {/* Chat Rows */}
      {CC.rowArray && CC.rowArray.length > 0 ? (
        <div id="llm-current-chat" className="flex flex-grow">
          <div id="chat-rows" className="w-full list-none">
            {/*-- Similar implemenatation to https://virtuoso.dev/stick-to-bottom/ --*/}
            <Virtuoso
              ref={virtuosoRef}
              data={CC.rowArray}
              itemContent={(index, row) => (
                <ChatRow
                  key={`${row.node_id}-${row.role}`}
                  row={row}
                  prevRow={
                    CC.rowArray && index > 0 ? CC.rowArray[index - 1] : null
                  }
                  chatToast={chatToast}
                />
              )}
              followOutput="auto"
              atBottomStateChange={(isAtBottom) => {
                setAtBottom(isAtBottom);
              }}
            />
          </div>
        </div>
      ) : (
        //-- Landing view for when no messages to render --//
        <ChatLanding />
      )}
    </>
  );
}
