import { useState, createContext, useContext, PropsWithChildren } from "react";
import {
  IConversation,
  IMessageRow,
  IModel,
  IModelFriendly,
  ModelAPINames,
} from "../App/GPT/chatson/chatson_types";

//-- Create interface and Context --//
export interface IChatContext {
  rowArray: IMessageRow[] | null;
  setRowArray: React.Dispatch<React.SetStateAction<IMessageRow[] | null>>;
  conversation: IConversation | null;
  setConversation: React.Dispatch<React.SetStateAction<IConversation | null>>;
  model: IModel;
  setModel: React.Dispatch<React.SetStateAction<IModel>>;
  model_friendly_names: Partial<Record<ModelAPINames, Object>>;
  model_options: Partial<Record<ModelAPINames, IModel>>;
  temperature: number | null;
  setTemperature: React.Dispatch<React.SetStateAction<number | null>>;
  completionLoading: boolean;
  setCompletionLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<IChatContext | undefined>(undefined);

//-- Custom Provider Component --//
function ChatContextProvider({ children }: PropsWithChildren) {
  //-- Enumerate current model options --//
  const model_options: Partial<Record<ModelAPINames, IModel>> = {
    "gpt-3.5-turbo": {
      api_provider_name: "openai",
      model_developer_name: "openai",
      model_api_name: "gpt-3.5-turbo",
    },
    "gpt-4": {
      api_provider_name: "openai",
      model_developer_name: "openai",
      model_api_name: "gpt-4",
    },
    // claude: {
    //   api_provider_name: "amazon_bedrock",
    //   model_developer_name: "anthropic",
    //   model_api_name: "claude",
    // },
    // "jurrasic-2": {
    //   api_provider_name: "amazon_bedrock",
    //   model_developer_name: "ai21labs",
    //   model_api_name: "jurrasic-2",
    // },
    // "amazon-titan": {
    //   api_provider_name: "amazon_bedrock",
    //   model_developer_name: "amazon",
    //   model_api_name: "amazon-titan",
    // },
  };
  const model_friendly_names: Partial<Record<ModelAPINames, IModelFriendly>> = {
    "gpt-3.5-turbo": {
      api_provider_friendly_name: "OpenAI",
      model_developer_friendly_name: "OpenAI",
      model_developer_link: "https://openai.com",
      model_friendly_name: "GPT-3.5",
      model_description: "Power and Speed",
    },
    "gpt-4": {
      api_provider_friendly_name: "OpenAI",
      model_developer_friendly_name: "OpenAI",
      model_developer_link: "https://openai.com",
      model_friendly_name: "GPT-4",
      model_description: "Max Power (slower)",
    },
    // claude: {
    //   api_provider_friendly_name: "Amazon Bedrock",
    //   model_developer_friendly_name: "Anthropic",
    //   model_developer_link: "https://anthropic.com",
    //   model_friendly_name: "Claude",
    //   model_description: "General purpose LLM",
    // },
    // "jurrasic-2": {
    //   api_provider_friendly_name: "Amazon Bedrock",
    //   model_developer_friendly_name: "AI21",
    //   model_developer_link: "https://ai21.com",
    //   model_friendly_name: "Jurrasic 2",
    //   model_description: "General purpose LLM",
    // },
    // "amazon-titan": {
    //   api_provider_friendly_name: "Amazon Bedrock",
    //   model_developer_friendly_name: "Amazon",
    //   model_developer_link: "https://aws.amazon.com/bedrock/titan",
    //   model_friendly_name: "Titan",
    //   model_description: "General purpose LLM",
    // },
  };

  //-- State values --//
  const [rowArray, setRowArray] = useState<IMessageRow[] | null>(null);
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [model, setModel] = useState<IModel>(
    model_options["gpt-3.5-turbo"] as IModel
  );
  const [temperature, setTemperature] = useState<number | null>(null);
  const [completionLoading, setCompletionLoading] = useState<boolean>(false);

  //-- BungetConversationsListHandlerle values into chatContextValue --//
  const chatContextValue: IChatContext = {
    rowArray,
    setRowArray,
    conversation,
    setConversation,
    model,
    setModel,
    model_friendly_names,
    temperature,
    setTemperature,
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
