//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import { useJournalContext } from "../Context/JournalContext";
import { ErrorBoundary } from "react-error-boundary";
import { EChartsFallback } from "../App/ECharts/EChartsFallback";
// import Some_Config from "../App/JournalService/Some_Config";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {
  tw_height: string;
  tw_width: string;
}
export default function PL_45_Days({ tw_height, tw_width }: IProps) {
  //-- React State --//
  const JC = useJournalContext();
  //-- Auth --//

  //-- Other --//

  //-- Click Handlers --//

  //-- Side Effects --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    // TODO - refactor this div and tailwind CSS into a wrapper
    <div
      className={classNames(
        `${tw_height} ${tw_width}`, // DEV - to be resizeable
        "mt-1 flex flex-col rounded-2xl px-3 pb-3 pt-4 shadow-md",
        "ring-1 ring-inset ring-zinc-800/10 dark:ring-zinc-100/10",
        "bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100"
        // !JC.somethingFetched || JC.somethingUpdating ? "animate-pulse" : ""
      )}
    >
      {/* Title */}
      <p className="text-center font-medium text-zinc-600 dark:text-zinc-200">
        Some Chart Title
      </p>

      {/* Chart and Fallback */}
      <ErrorBoundary FallbackComponent={EChartsFallback}>
        {/* <Some_Config /> */}
      </ErrorBoundary>
    </div>
  );
}
