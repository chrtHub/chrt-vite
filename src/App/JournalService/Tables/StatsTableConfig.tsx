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

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function StatsTableConfig() {
  //== React State, Custom Hooks ==//
  const JC = useJournalContext();
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  //== Auth ==//

  //== Other ==//
  const fetch = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      let res = await axios.get(`${VITE_ALB_BASE_URL}/journal/stats/all_time`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      let data = res.data; // todo - add type interface here

      // todo - manipulate data if needed
      console.log(data); // DEV

      //-- Update State in Context --//
      JC.setStatsAllTime(data);
    } catch (err) {
      console.log(err); // dev
      showBoundary(err);
    } finally {
      //-- Set fetched --//
      JC.setStatsAllTimeFetched(true);
    }
  };
  //== Side Effects ==//
  useEffect(() => {
    fetch();
  }, []);

  //== Handlers ==//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-2">
      <p className="text-xl font-medium text-zinc-500">being built...</p>
      {/* Very DEV */}
      <p className="mt-2 text-zinc-700 dark:text-zinc-200">
        {JC.statsAllTime.toString()}
      </p>
    </div>
  );
}
