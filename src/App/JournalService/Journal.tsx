//-- react, react-router-dom, Auth0 --//
import { useState } from "react";
//-- TSX Components --//
import CTA401Fallback from "./CTA401Fallback";

import PL_45_Days from "./PL_45_Days";

//-- NPM Components --//
import GridLayout from "react-grid-layout";

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
      <div className="h-[300px] w-[100%]">
        <PL_45_Days />
      </div>

      {/* Grid Layout */}
      <div className="h-full w-full bg-zinc-100">{/* TODO */}</div>
    </>
  );
}
