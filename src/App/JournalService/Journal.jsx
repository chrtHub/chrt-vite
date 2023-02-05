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

  const { isLoading, isAuthenticated, user, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://chrt.com",
          },
        });
        console.log("accessToken1: " + accessToken); // DEV

        //-- Request parameters --//
        const url = "https://alb.chrt.com";
        const headersObject = {
          authorization: `Bearer ${accessToken}`,
        };

        //-- Make GET request --//
        try {
          let res = await axios.get(url, { headers: headersObject });
          setJournalData(res);
          //----//
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log("error: " + err.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      {/*  */}
      <div className="m-2 divide-y divide-zinc-200 overflow-hidden rounded-lg bg-white text-black shadow dark:divide-zinc-600 dark:bg-zinc-800 dark:text-white">
        <div className="px-4 py-5 sm:p-6">Content</div>
        <div className="px-4 py-4 sm:px-6">Footer</div>
      </div>

      {/*  */}
      <div className="m-2 divide-y divide-zinc-200 overflow-hidden rounded-lg bg-white text-black shadow dark:divide-zinc-600 dark:bg-zinc-800 dark:text-white">
        <div className="px-4 py-5 sm:p-6">Content</div>
        <div className="px-4 py-4 sm:px-6">Footer</div>
      </div>

      {/*  */}
      <div className="m-2 divide-y divide-zinc-200 overflow-hidden rounded-lg bg-white text-black shadow dark:divide-zinc-600 dark:bg-zinc-800 dark:text-white">
        <div className="px-4 py-5 sm:p-6">Content</div>
        <div className="px-4 py-4 sm:px-6">Footer</div>
      </div>

      <h3 className="text-zinc-900 dark:text-white">Journal Data</h3>
      {journalData ? (
        <pre className="text-zinc-900 dark:text-white">
          {JSON.stringify(journalData, null, 2)}
        </pre>
      ) : (
        "No journal data"
      )}
    </>
  );
}
