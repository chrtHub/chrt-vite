//== react, react-router-dom, Auth0 ==//
import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import { useJournalContext } from "../../../Context/JournalContext";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios, { AxiosError } from "axios";

//== Utility Functions ==//
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";

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
      console.log(res.data); // DEV
      JC.setStatsAllTime(res.data);
      //----//
    } catch (err) {
      console.log(err); // dev
      showBoundary(err);
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
      <p className="mt-2 text-zinc-700 dark:text-zinc-200">{JC.statsAllTime}</p>
    </div>
  );
}
