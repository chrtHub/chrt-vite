import { useState, createContext, useContext, PropsWithChildren } from "react";
import { IConversation, IModel, ModelAPINames } from "../App/GPT/chatson/types";

//-- Create interface and Context --//
interface IChatContext {
  conversation: IConversation | null;
  setConversation: React.Dispatch<React.SetStateAction<IConversation | null>>;
  model: IModel;
  setModel: React.Dispatch<React.SetStateAction<IModel>>;
  ModelOptions: Record<ModelAPINames, IModel>;
  completionLoading: boolean;
  setCompletionLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<IChatContext | undefined>(undefined);

//-- Custom Provider Component --//
function ChatContextProvider({ children }: PropsWithChildren) {
  //-- Values to be included in the Chat Context --//
  const ModelOptions: Record<ModelAPINames, IModel> = {
    "gpt-3.5-turbo": {
      api_name: "gpt-3.5-turbo",
      friendly_name: "GPT-3.5",
      description: "Power and Speed",
    },
    "gpt-4": {
      api_name: "gpt-4",
      friendly_name: "GPT-4",
      description: "Extra Power (Slower)",
    },
    "gpt-4-32k": {
      api_name: "gpt-4-32k",
      friendly_name: "GPT-4-32k",
      description: "For very large prompts",
    },
  };
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [model, setModel] = useState<IModel>(ModelOptions["gpt-3.5-turbo"]);
  const [completionLoading, setCompletionLoading] = useState<boolean>(false);

  //-- Bundle values --//
  const chatContextValue = {
    conversation,
    setConversation,
    model,
    setModel,
    ModelOptions,
    completionLoading,
    setCompletionLoading,
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
