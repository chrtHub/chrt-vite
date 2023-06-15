//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import CTA401Fallback from "./CTA401Fallback";

import { useJournalContext } from "../../Context/JournalContext";

import PL_45_Days from "./PL_45_Days";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Journal() {
  //-- React State --//
  let JC = useJournalContext();

  //-- Auth0 --//

  //-- Data Fetching --//

  //-- Other --//

  //-- Click Handlers --//

  //-- Side Effects --//

  return (
    <>
      <CTA401Fallback />
      <PL_45_Days tw_height={"h-[400px]"} tw_width={"w-[100%]"} />
    </>
  );
}
