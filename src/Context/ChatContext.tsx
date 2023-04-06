import { useState, createContext, useContext, PropsWithChildren } from "react";
import {
  IChatsonObject,
  IChatsonModel,
  CurrentChatsonModelNames,
} from "../App/GPT/chatson/types";

interface IChatContext {
  chatson: IChatsonObject | null;
  setChatson: React.Dispatch<React.SetStateAction<IChatsonObject | null>>;
  model: IChatsonModel;
  setModel: React.Dispatch<React.SetStateAction<IChatsonModel>>;
  CurrentChatsonModels: Record<CurrentChatsonModelNames, IChatsonModel>;
  llmLoading: boolean;
  setLLMLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const ChatContext = createContext<IChatContext | undefined>(undefined);

//-- Custom Provider Component --//
function ChatContextProvider({ children }: PropsWithChildren) {
  //-- Values to be included in the Chat Context --//
  const CurrentChatsonModels: Record<CurrentChatsonModelNames, IChatsonModel> =
    {
      "gpt-3.5-turbo": {
        apiName: "gpt-3.5-turbo",
        friendlyName: "GPT-3.5",
        description: "Power and Speed",
      },
      "gpt-4": {
        apiName: "gpt-4",
        friendlyName: "GPT-4",
        description: "Extra Power (Slower)",
      },
      "gpt-4-32k": {
        apiName: "gpt-4-32k",
        friendlyName: "GPT-4-32k",
        description: "For very large prompts",
      },
    };
  const [chatson, setChatson] = useState<IChatsonObject | null>(null);
  const [model, setModel] = useState<IChatsonModel>(
    CurrentChatsonModels["gpt-3.5-turbo"]
  );
  const [llmLoading, setLLMLoading] = useState<boolean>(false);

  //-- Bundle values --//
  const chatContextValue = {
    chatson,
    setChatson,
    model,
    setModel,
    CurrentChatsonModels,
    llmLoading,
    setLLMLoading,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
}

//-- Custom Consumer Hook --//
function useChatContext() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
}

//-- Export Provider Component and Consumer Hook ---//
export { ChatContextProvider, useChatContext };
