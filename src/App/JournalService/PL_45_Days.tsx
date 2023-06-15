//-- react, react-router-dom, Auth0 --//
import { useEffect, useState, useRef } from "react";

//-- TSX Components --//
import { useJournalContext } from "../../Context/JournalContext";
import { ErrorBoundary } from "react-error-boundary";
import { EChartsFallback } from "../ECharts/EChartsFallback";
import PL_45_Days_Config from "./PL_45_Days_Config";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function PL_45_Days() {
  //-- React State --//
  const JC = useJournalContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  //-- Auth --//

  //-- Other --//

  //-- Click Handlers --//

  //-- Side Effects --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    // TODO - refactor this div and tailwind CSS into a wrapper
    <div
      ref={containerRef}
      className={classNames(
        `h-full w-full`,
        "flex flex-col rounded-2xl px-3 pb-3 pt-4 shadow-md",
        "ring-1 ring-inset ring-zinc-800/10 dark:ring-zinc-100/10",
        "bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100",
        !JC.pl45DaysFetched || JC.pl45DaysUpdating ? "animate-pulse" : ""
      )}
    >
      {/* Title */}
      <p className="text-center font-medium text-zinc-600 dark:text-zinc-200">
        Profit & Loss, Trading Days in Past 45 Calendar Days
      </p>

      {/* Chart and Fallback */}
      <ErrorBoundary FallbackComponent={EChartsFallback}>
        <PL_45_Days_Config />
      </ErrorBoundary>
    </div>
  );
}
