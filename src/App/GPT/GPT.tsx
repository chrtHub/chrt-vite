//-- react, react-router-dom, Auth0 --//
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

//-- TSX Components --//
import ChatSession from "./ChatSession";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import { toast } from "react-toastify";
import { ObjectId } from "bson";
import ActiveDevelopmentBanner from "../JournalService/ActiveDevelopmentBanner";

//-- Utility Functions --//

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function GPT() {
  //-- React State --//
  const { entity_type, conversation_id } = useParams();

  //-- Auth --//
  //-- Redirect to sign in if token is expired --//
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const checkForFreshAccessToken = async () => {
      await getAccessTokenSilently();
    };
    checkForFreshAccessToken();
  }, []);

  //-- Other [] --//

  //-- Side Effects --//
  //-- Validate path params --//
  useEffect(() => {
    const validEntityTypes = [
      "c", //-- for "conversation" --//
    ];

    //-- If invalid entity type, toast --//
    if (entity_type && !validEntityTypes.includes(entity_type)) {
      toast(`Invalid URL parameter: "/${entity_type}"`);
    }
    //-- Else if invalid ObjectId, toast --//
    else if (conversation_id && !ObjectId.isValid(conversation_id)) {
      toast(`Invalid conversation id: ${conversation_id}`);
    }
  }, [entity_type, conversation_id]);

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <>
      <div className="my-3">
        <ActiveDevelopmentBanner />
      </div>

      <div id="gpt-grid-div" className="grid h-full grid-cols-12 gap-2">
        <div id="gpt-chat-current" className="col-span-12 h-full">
          <ChatSession />
        </div>
      </div>
    </>
  );
}
