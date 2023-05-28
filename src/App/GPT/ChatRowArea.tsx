//== react, react-router-dom, recoil, Auth0 ==//
import { useEffect } from "react";
import { useChatContext } from "../../Context/ChatContext";

//== TSX Components ==//
import ChatRow from "./ChatRow";
import ChatLanding from "./ChatLanding";

//== NPM Components ==//
import { useErrorBoundary } from "react-error-boundary";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

//== Icons ==//

//== NPM Functions ==//
import { getPermissions } from "../../Auth/getPermissions";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

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
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    try {
      const permissionCheck = async () => {
        let permissions = await getPermissions();
        if (!permissions.includes("chat:llm")) {
          throw new Error();
          showBoundary(new Error("test"));
        }
      };
      permissionCheck();
    } catch (err) {
      throw err;
    }
  }, []);

  return (
    <>
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
        //-- Landing view for null conversation --//
        <ChatLanding />
      )}
    </>
  );
}
