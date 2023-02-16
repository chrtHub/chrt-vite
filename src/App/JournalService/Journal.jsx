//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//-- Data Objects --//
import { journalDataState } from "./atoms";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Journal() {
  //-- React State --//
  const [loading, setLoading] = useState(false);

  //-- Recoil State --//
  const [journalData, setJournalData] = useRecoilState(journalDataState);

  //-- Auth0 --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Side Effect for fetching journal data --//
  useEffect(() => {
    const getJournalData = async () => {
      try {
        //-- Get access token from memory or request new token --//
        let accessToken = await getAccessTokenSilently();

        //-- Make GET request --//
        setLoading(true);
        let res = await axios.get("https://alb.chrt.com/", {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        setJournalData(res.data);
        setLoading(false);
        //----//
      } catch (err) {
        console.log(err);
      }
    };
    getJournalData();
  }, [getAccessTokenSilently]);

  return (
    <>
      <div
        className={classNames(
          loading
            ? "animate-pulse bg-zinc-50 dark:bg-zinc-800"
            : "bg-white dark:bg-zinc-900",
          "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg   text-black shadow dark:divide-zinc-600  dark:text-white"
        )}
        // "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg bg-white text-black shadow dark:divide-zinc-600 dark:bg-zinc-800 dark:text-white"
      >
        <div className="py-5 sm:p-6">
          {journalData ? (
            <pre className="text-zinc-900 dark:text-white">
              {JSON.stringify(journalData, null, 2)}
            </pre>
          ) : (
            "..." // TODO - use a loading skeleton here
          )}
        </div>
        <div className="px-4 py-4 sm:px-6">Journal Data</div>
      </div>
    </>
  );
}
