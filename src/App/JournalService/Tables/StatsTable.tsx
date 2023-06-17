//-- react, react-router-dom, Auth0 --//
import { ErrorBoundary } from "react-error-boundary";

//-- TSX Components --//
import { useJournalContext } from "../../../Context/JournalContext";
import { EChartsFallback } from "../Reuseable/EChartsFallback";
import TableContainer from "../Reuseable/TableContainer";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

import StatsTableConfig from "./StatsTableConfig";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function StatsTable() {
  //== React State, Custom Hooks ==//
  const JC = useJournalContext();

  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <>
      <TableContainer
        fetched={true} // TODO
        updating={false} // TODO
        title={"Stats Table (All Time)"}
      >
        <ErrorBoundary FallbackComponent={EChartsFallback}>
          <StatsTableConfig />
        </ErrorBoundary>
      </TableContainer>
    </>
  );
}
