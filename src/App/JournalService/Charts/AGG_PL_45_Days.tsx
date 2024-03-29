//-- react, react-router-dom, Auth0 --//
import { useEffect, useState, useRef } from "react";

//-- TSX Components --//
import { useJournalContext } from "../../../Context/JournalContext";
import { ErrorBoundary } from "react-error-boundary";
import { EChartsFallback } from "../Reuseable/EChartsFallback";
import EChartContainer from "../Reuseable/EChartContainer";

import PL_45_Days_Config from "./PL_45_Days_Config";
import AGG_PL_45_Days_Config from "./AGG_PL_45_Days_Config";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AGG_PL_45_Days() {
  //-- React State --//
  const JC = useJournalContext();

  //-- Auth --//

  //-- Other --//

  //-- Click Handlers --//

  //-- Side Effects --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <>
      <EChartContainer
        fetched={JC.pl45DaysFetched}
        updating={JC.pl45DaysUpdating}
        title={"Aggregate Profit & Loss (45 Days)"}
      >
        <ErrorBoundary FallbackComponent={EChartsFallback}>
          <AGG_PL_45_Days_Config />
        </ErrorBoundary>
      </EChartContainer>
    </>
  );
}
