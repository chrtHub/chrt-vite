//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import PL_45_Days from "./Charts/PL_45_Days";
import CTA401Fallback from "./CTA401Fallback";
//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Journal() {
  //-- React State --//

  //-- Auth0 --//

  //-- Data Fetching --//

  //-- Other --//

  //-- Click Handlers --//

  //-- Side Effects --//

  return (
    <>
      <CTA401Fallback />
      <PL_45_Days />
    </>
  );
}
