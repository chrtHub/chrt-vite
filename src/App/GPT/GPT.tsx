//-- react, react-router-dom, recoil, Auth0 --//
import { createContext, useState } from "react";

//-- TSX Components --//
import ChatSession from "./ChatSession";
// import ChatHistory from "./ChatHistory";
import {
  IChatsonObject,
  IChatsonModel,
  CurrentChatsonModelNames,
} from "./chatson/types";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- Chat Context --//
const CurrentChatsonModels: Record<CurrentChatsonModelNames, IChatsonModel> = {
  "gpt-3.5-turbo": {
    apiName: "gpt-3.5-turbo",
    friendlyName: "GPT-3.5 Turbo",
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

interface IChatContext {
  chatson: IChatsonObject | null;
  setChatson: React.Dispatch<React.SetStateAction<IChatsonObject | null>>;
  model: IChatsonModel;
  setModel: React.Dispatch<React.SetStateAction<IChatsonModel>>;
  CurrentChatsonModels: Record<CurrentChatsonModelNames, IChatsonModel>;
}
const defaultContextValue: IChatContext = {
  chatson: null,
  setChatson: () => {},
  model: CurrentChatsonModels["gpt-3.5-turbo"],
  setModel: () => {},
  CurrentChatsonModels: CurrentChatsonModels,
};
export const ChatContext = createContext<IChatContext>(defaultContextValue);

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function GPT() {
  //-- React State --//
  const [chatson, setChatson] = useState<IChatsonObject | null>(null);
  const [model, setModel] = useState<IChatsonModel>(
    CurrentChatsonModels["gpt-3.5-turbo"]
  );
  const chatContextValue = {
    chatson,
    setChatson,
    model,
    setModel,
    CurrentChatsonModels,
  };

  //-- Recoil State --//

  //-- Auth --//

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <ChatContext.Provider value={chatContextValue}>
      <div id="gpt-grid-div" className="grid h-full grid-cols-12 gap-2">
        <div
          id="gpt-chat-current"
          className="col-span-12 h-full overflow-y-auto"
        >
          <ChatSession />
        </div>

        {/* <div
          id="gpt-chat-history"
          className="col-span-3 h-full overflow-y-auto"
        >
          <ChatHistory />
        </div> */}
      </div>
    </ChatContext.Provider>
  );
}
