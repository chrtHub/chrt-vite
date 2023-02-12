//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Journal() {
  const [journalData, setJournalData] = useState(null);

  const { getAccessTokenSilently } = useAuth0();

  //-- Side Effect for fetching journal data --//
  useEffect(() => {
    const getJournalData = async () => {
      try {
        //-- Get access token from memory or request new token --//
        let accessToken = await getAccessTokenSilently();

        //-- Make GET request --//
        let res = await axios.get("https://alb.chrt.com/", {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        setJournalData(res.data);
        //----//
      } catch (err) {
        console.log(err);
      }
    };
    getJournalData();
  }, [getAccessTokenSilently]);

  return (
    <>
      <div className="mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg bg-white text-black shadow dark:divide-zinc-600 dark:bg-zinc-800 dark:text-white">
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
