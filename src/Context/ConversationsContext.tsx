import {
  useState,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IConversationSerialized } from "../App/GPT/chatson/chatson_types";
import getConversationsList from "../App/GPT/chatson/getConversationsList";

//-- Create interface and Context --//
export interface IConversationsContext {
  conversationsArray: IConversationSerialized[] | null;
  setConversationsArray: React.Dispatch<
    React.SetStateAction<IConversationSerialized[] | null>
  >;
}

const ConversationsContext = createContext<IConversationsContext | undefined>(
  undefined
);

//-- Custom Provider Component --//
function ConversationsContextProvider({ children }: PropsWithChildren) {
  //-- State values --//
  const [conversationsArray, setConversationsArray] = useState<
    IConversationSerialized[] | null
  >(null);

  //-- Get conversations list on mount --//
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const getConversationsListHandler = async () => {
      let accessToken = await getAccessTokenSilently();
      let list = await getConversationsList(
        accessToken,
        conversationsArray?.length || 0
      );
      setConversationsArray(list);
    };
    getConversationsListHandler();
  }, []);

  //-- Bundle values into ConversationsContextValue --//
  const conversationsContextValue: IConversationsContext = {
    conversationsArray,
    setConversationsArray,
  };

  return (
    <ConversationsContext.Provider value={conversationsContextValue}>
      {children}
    </ConversationsContext.Provider>
  );
}

//-- Custom Consumer Hook --//
function useConversationsContext() {
  const context = useContext(ConversationsContext);

  if (context === undefined) {
    throw new Error(
      "useConversationsContext must be used within a ConversationsContextProvider"
    );
  }
  return context;
}

//-- Export Provider Component and Consumer Hook ---//
export { ConversationsContextProvider, useConversationsContext };
