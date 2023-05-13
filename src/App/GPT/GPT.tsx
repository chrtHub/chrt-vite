//-- react, react-router-dom, recoil, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

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
  // TESTING - want to redirect to sign in if token is expired
  const { getAccessTokenSilently } = useAuth0(); // NEW
  let accessToken = getAccessTokenSilently(); // NEW
  //

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div id="gpt-grid-div" className="grid h-full grid-cols-12 gap-2">
      <div id="gpt-chat-current" className="col-span-12 h-full">
        <ChatSession />
      </div>
    </div>
  );
}
