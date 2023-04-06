//-- react, react-router-dom, recoil, Auth0 --//

//-- TSX Components --//
import ChatSession from "./ChatSession";
// import ChatHistory from "./ChatHistory";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function GPT() {
  //-- React State --//

  //-- Recoil State --//

  //-- Auth --//

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div id="gpt-grid-div" className="grid h-full grid-cols-12 gap-2">
      <div
        id="gpt-chat-current"
        // DEV - overflow-y-auto
        className="col-span-12 h-full"
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
  );
}
