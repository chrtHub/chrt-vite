import { useState, createContext, useContext, PropsWithChildren } from "react";
import { IConversation, IModel, ModelAPINames } from "../App/GPT/chatson/types";

import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";

//-- Create interface and Context --//
interface IChatContext {
  conversation: IConversation | null;
  setConversation: React.Dispatch<React.SetStateAction<IConversation>>;
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

  //-- New conversation --//
  const conversation_uuid = uuidv4();
  const system_message_uuid = uuidv4();
  const timestamp = getUnixTime(new Date()).toString();

  const newConversation: IConversation = {
    conversation_uuid: conversation_uuid,
    message_order: {
      1: {
        1: system_message_uuid,
      },
    },
    messages: {
      system_message_uuid: {
        message_uuid: system_message_uuid,
        author: "chrt",
        model: {
          api_name: "gpt-3.5-turbo",
          friendly_name: "GPT-3.5",
          description: "Power and Speed",
        },
        timestamp: timestamp,
        role: "system",
        message:
          "Your name is ChrtGPT. Refer to yourself as ChrtGPT. You are ChrtGPT, a helpful assistant that helps power a day trading performance journal. You sometimes make jokes and say silly things on purpose.",
      },
    },
    apiResponses: [],
  };
  const [conversation, setConversation] =
    useState<IConversation>(newConversation);
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
