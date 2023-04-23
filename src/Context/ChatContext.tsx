import { useState, createContext, useContext, PropsWithChildren } from "react";
import {
  IConversation,
  IModel,
  ModelAPINames,
  UUIDV4,
} from "../App/GPT/chatson/chatson_types";
import { ObjectId } from "bson";
import { getUUIDV4 } from "../Util/getUUIDV4";

//-- Create interface and Context --//
interface IChatContext {
  conversation: IConversation;
  setConversation: React.Dispatch<React.SetStateAction<IConversation>>;
  model: IModel;
  setModel: React.Dispatch<React.SetStateAction<IModel>>;
  model_options: Partial<Record<ModelAPINames, IModel>>;
  completionLoading: boolean;
  setCompletionLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<IChatContext | undefined>(undefined);

//-- Custom Provider Component --//
function ChatContextProvider({ children }: PropsWithChildren) {
  //-- Enumerate current model options --//
  const model_options: Partial<Record<ModelAPINames, IModel>> = {
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
  };

  //-- Create new conversation --//
  const dummy_ObjectId = new ObjectId("000000000000000000000000");
  const dummy_uuid: UUIDV4 = getUUIDV4("dummy");

  const newConversation: IConversation = {
    _id: dummy_ObjectId,
    schema_version: "2023-04-20",
    created_at: new Date(), //-- Overwritten by server --//
    message_order: {
      1: {
        1: dummy_uuid,
      },
    },
    messages: {
      [dummy_uuid]: {
        message_uuid: dummy_uuid,
        author: "chrt",
        model: {
          api_name: "gpt-3.5-turbo",
          friendly_name: "GPT-3.5",
          description: "Power and Speed",
        },
        created_at: new Date(), //-- Overwritten by server --//
        role: "system",
        message:
          "This is a dummy object that declares the default model and satisfies the shape of the interface 'IConversation'. New conversations are initialized on the server.",
      },
    },
    api_responses: [],
    chatson_tags: [],
    user_tags: [],
  };

  const [conversation, setConversation] =
    useState<IConversation>(newConversation);
  const [model, setModel] = useState<IModel>(
    model_options["gpt-3.5-turbo"] as IModel
  );
  const [completionLoading, setCompletionLoading] = useState<boolean>(false);

  //-- Bundle values into chatContextValue --//
  const chatContextValue = {
    conversation,
    setConversation,
    model,
    setModel,
    model_options,
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
