//-- react, react-router-dom, Auth0 --//
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSiteContext } from "../../Context/SiteContext";

//-- TSX Components --//
import { useJournalContext } from "../../Context/JournalContext";
import { ErrorBoundary } from "react-error-boundary";
import { EChartsFallback } from "./EChartsFallback";
import PL_45_Days_Config from "./PL_45_Days_Config";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../Util/classNames";

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
    <div
      className={classNames(
        "mt-1 rounded-2xl px-3 pb-3 pt-4",
        "shadow-md",
        "ring-1 ring-inset ring-zinc-800/10 dark:ring-zinc-100/10",
        JC.pl45DaysFetched
          ? "animate-pulse bg-zinc-100 dark:bg-zinc-800"
          : "bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100"
      )}
    >
      {/* Title */}
      <p className="text-center font-medium text-zinc-600 dark:text-zinc-200">
        "Profit & Loss, Trading Days in Past 45 Calendar Days"
      </p>

      <ErrorBoundary
        FallbackComponent={(fallbackProps) => (
          <EChartsFallback
            {...fallbackProps}
            tw_height={tw_height}
            tw_width={tw_width}
          />
        )}
      >
        <PL_45_Days_Config tw_height={tw_height} tw_width={tw_width} />
      </ErrorBoundary>
    </div>
  );
}
