//== react, react-router-dom, Auth0 ==//
import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import { useJournalContext } from "../../../Context/JournalContext";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios from "axios";
import numeral from "numeral";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IStatsAllTime } from "../Types/journal_types";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function StatsTableConfig() {
  //== React State, Custom Hooks ==//
  const JC = useJournalContext();
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//
  useEffect(() => {
    const fetch = async () => {
      try {
        //-- Get access token from memory or request new token --//
        let accessToken = await getAccessTokenSilently();

        //-- Make GET request --//
        let res = await axios.get(
          `${VITE_ALB_BASE_URL}/journal/stats/all_time`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        let data: IStatsAllTime = res.data;

        //-- Update State in Context --//
        JC.setStatsAllTime(data);
      } catch (err) {
        console.log(err); // DEV
        showBoundary(err);
      } finally {
        //-- Set fetched --//
        JC.setStatsAllTimeFetched(true);
      }
    };
    fetch();
  }, []);

  //== Handlers ==//

  let win_rate = "n/a";
  if (
    JC.statsAllTime &&
    JC.statsAllTime.winning_trades &&
    JC.statsAllTime?.total_trades
  ) {
    win_rate = (
      JC.statsAllTime.winning_trades / JC.statsAllTime.total_trades
    ).toString();
  }

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex h-full flex-row justify-center space-x-4">
      <div className="flex h-full w-full flex-col items-start justify-center space-y-3 px-2">
        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          <span className="text-base">Total net proceeds:</span>{" "}
          <span className="text-xl font-bold">
            {numeral(JC.statsAllTime?.total_net_proceeds).format("$0.0a")}
          </span>
        </p>

        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Sum, winning trades:{" "}
          <span className="text-xl font-bold">
            {numeral(JC.statsAllTime?.sum_winning_trades).format("$0.0a")}
          </span>
        </p>
        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Sum, losing trades:{" "}
          <span className="text-xl font-bold">
            {numeral(JC.statsAllTime?.sum_losing_trades).format("$0.0a")}
          </span>
        </p>

        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Total Fees:{" "}
          <span className="text-xl font-bold">
            {numeral(JC.statsAllTime?.total_fees).format("$0,0")}
          </span>
        </p>
      </div>

      <div className="flex h-full w-full flex-col items-start justify-center space-y-3 px-2">
        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Total trades:{" "}
          <span className="text-xl font-bold">
            {JC.statsAllTime?.total_trades}
          </span>
        </p>

        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Win rate:{" "}
          <span className="text-xl font-bold">
            {numeral(win_rate).format("0.00%")}
          </span>
        </p>
        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Winning Trades:{" "}
          <span className="text-xl font-bold">
            {JC.statsAllTime?.winning_trades}
          </span>
        </p>
        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Losing Trades:{" "}
          <span className="text-xl font-bold">
            {JC.statsAllTime?.losing_trades}
          </span>
        </p>
        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Breakeven Trades:{" "}
          <span className="text-xl font-bold">
            {JC.statsAllTime?.breakeven_trades}
          </span>
        </p>
        <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
          Total symbols:{" "}
          <span className="text-xl font-bold">
            {JC.statsAllTime?.total_symbols}
          </span>
        </p>
      </div>
    </div>
  );

  // return (
  //   <div className="flex h-full flex-row justify-center space-x-4 p-6">
  //     <div className="flex h-full w-full flex-col items-start justify-center space-y-3 px-2">
  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Total net proceeds:{" "}
  //         {numeral(JC.statsAllTime?.total_net_proceeds).format("$0.0a")}
  //       </p>

  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Sum, winning trades:{" "}
  //         {numeral(JC.statsAllTime?.sum_winning_trades).format("$0.0a")}
  //       </p>
  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Sum, losing trades:{" "}
  //         {numeral(JC.statsAllTime?.sum_losing_trades).format("$0.0a")}
  //       </p>

  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Total Fees: {numeral(JC.statsAllTime?.total_fees).format("$0,0")}
  //       </p>
  //     </div>

  //     <div className="flex h-full w-full flex-col items-start justify-center space-y-3 px-2">
  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Total trades: {JC.statsAllTime?.total_trades}
  //       </p>

  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Win rate: {numeral(win_rate).format("0.00%")}
  //       </p>
  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Winning Trades: {JC.statsAllTime?.winning_trades}
  //       </p>
  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Losing Trades: {JC.statsAllTime?.losing_trades}
  //       </p>
  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Breakeven Trades: {JC.statsAllTime?.breakeven_trades}
  //       </p>
  //       <p className="mt-1 text-zinc-700 transition-colors hover:text-zinc-500 dark:text-zinc-200">
  //         Total symbols: {JC.statsAllTime?.total_symbols}
  //       </p>
  //     </div>
  //   </div>
  // );
}
