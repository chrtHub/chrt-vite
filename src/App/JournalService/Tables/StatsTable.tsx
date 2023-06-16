//-- react, react-router-dom, Auth0 --//
import { useEffect, useState, useRef } from "react";

//-- TSX Components --//
import { useJournalContext } from "../../../Context/JournalContext";
import { ErrorBoundary } from "react-error-boundary";
import { EChartsFallback } from "../Reuseable/EChartsFallback";
import TableContainer from "../Reuseable/TableContainer";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function StatsTable() {
  //-- React State --//
  const JC = useJournalContext();

  //-- Auth --//

  //-- Other --//

  //-- Click Handlers --//

  //-- Side Effects --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <>
      <TableContainer
        fetched={true} // TODO
        updating={false} // TODO
        title={"Stats Table"}
      >
        <ErrorBoundary FallbackComponent={EChartsFallback}>
          {/* TODO - table config? */}
          <div className="flex h-full w-full flex-col items-center justify-center px-2">
            <p className="text-xl font-medium text-zinc-500">coming soon</p>
          </div>
        </ErrorBoundary>
      </TableContainer>
    </>
  );
}
