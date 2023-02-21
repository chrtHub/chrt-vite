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

//-- Data Objects, Environment Variables --//
import { journalDataState } from "./atoms";
import { journalPL45DaysState } from "./atoms";
import { journalTradeUUIDsByDateState } from "./atoms";
import { tradeSummaryByTradeUUIDState } from "./atoms";
import { txnsByTradeUUIDState } from "./atoms";

let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Journal() {
  //-- React State --//

  //-- Recoil State --//
  const [journalData, setJournalData] = useRecoilState(journalDataState);
  const [journalPL45Days, setJournalPL45Days] =
    useRecoilState(journalPL45DaysState);
  const [journalTradeUUIDsByDate, setJournalTradeUUIDsByDate] = useRecoilState(
    journalTradeUUIDsByDateState
  );
  const [tradeSummaryByTradeUUID, setTradeSummaryByTradeUUID] = useRecoilState(
    tradeSummaryByTradeUUIDState
  );
  const [txnsByTradeUUID, setTxnsByTradeUUID] =
    useRecoilState(txnsByTradeUUIDState);

  //-- Auth0 --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Side Effect for fetching journal data --//
  useEffect(() => {
    const getJournalData = async () => {
      try {
        //-- Get access token from memory or request new token --//
        let accessToken = await getAccessTokenSilently();

        //-- / --//
        let res1 = await axios.get(`${VITE_ALB_BASE_URL}/`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        setJournalData(res1.data);

        //-- pl_last_45_calendar_days --//
        let res2 = await axios.get(
          `${VITE_ALB_BASE_URL}/journal/dashboard/pl_last_45_calendar_days`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setJournalPL45Days(res2.data);

        //-- /trade_uuids_by_date --//
        let date = null; // TODO
        let res3 = await axios.get(
          `${VITE_ALB_BASE_URL}/journal/trade_uuids_by_date/${date}`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setJournalTradeUUIDsByDate(res3.data);

        //-- /trade_summary_by_trade_uuid --//
        let trade_uuid = null; // TODO
        let res4 = await axios.get(
          `${VITE_ALB_BASE_URL}/journal/trade_summary_by_trade_uuid/${trade_uuid}`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTradeSummaryByTradeUUID(res4.data);

        //-- /txns_by_trade_uuid  --//
        let res5 = await axios.get(
          `${VITE_ALB_BASE_URL}/journal/txns_by_trade_uuid/${trade_uuid}`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTxnsByTradeUUID(res5.data);
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
          !journalData
            ? "animate-pulse bg-zinc-100 dark:bg-zinc-800"
            : "bg-white dark:bg-zinc-900",
          "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg text-black shadow dark:divide-zinc-600  dark:text-white"
        )}
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

      <div
        className={classNames(
          !journalPL45Days
            ? "animate-pulse bg-zinc-100 dark:bg-zinc-800"
            : "bg-white dark:bg-zinc-900",
          "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg   text-black shadow dark:divide-zinc-600  dark:text-white"
        )}
      >
        <div className="py-5 sm:p-6">
          {journalPL45Days ? (
            <pre className="text-zinc-900 dark:text-white">
              {JSON.stringify(journalPL45Days, null, 2)}
            </pre>
          ) : (
            "..." // TODO - use a loading skeleton here
          )}
        </div>
        <div className="px-4 py-4 sm:px-6">
          P&L, trading days in last 45 calendar days
        </div>
      </div>

      <div
        className={classNames(
          !journalTradeUUIDsByDate
            ? "animate-pulse bg-zinc-100 dark:bg-zinc-800"
            : "bg-white dark:bg-zinc-900",
          "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg   text-black shadow dark:divide-zinc-600  dark:text-white"
        )}
      >
        <div className="py-5 sm:p-6">
          {journalTradeUUIDsByDate ? (
            <pre className="text-zinc-900 dark:text-white">
              {JSON.stringify(journalTradeUUIDsByDate, null, 2)}
            </pre>
          ) : (
            "..." // TODO - use a loading skeleton here
          )}
        </div>
        <div className="px-4 py-4 sm:px-6">journalTradeUUIDsByDate</div>
      </div>

      <div
        className={classNames(
          !tradeSummaryByTradeUUID
            ? "animate-pulse bg-zinc-100 dark:bg-zinc-800"
            : "bg-white dark:bg-zinc-900",
          "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg   text-black shadow dark:divide-zinc-600  dark:text-white"
        )}
      >
        <div className="py-5 sm:p-6">
          {tradeSummaryByTradeUUID ? (
            <pre className="text-zinc-900 dark:text-white">
              {JSON.stringify(tradeSummaryByTradeUUID, null, 2)}
            </pre>
          ) : (
            "..." // TODO - use a loading skeleton here
          )}
        </div>
        <div className="px-4 py-4 sm:px-6">tradeSummaryByTradeUUID</div>
      </div>

      <div
        className={classNames(
          !txnsByTradeUUIDState
            ? "animate-pulse bg-zinc-100 dark:bg-zinc-800"
            : "bg-white dark:bg-zinc-900",
          "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg   text-black shadow dark:divide-zinc-600  dark:text-white"
        )}
      >
        <div className="py-5 sm:p-6">
          {txnsByTradeUUIDState ? (
            <pre className="text-zinc-900 dark:text-white">
              {JSON.stringify(txnsByTradeUUIDState, null, 2)}
            </pre>
          ) : (
            "..." // TODO - use a loading skeleton here
          )}
        </div>
        <div className="px-4 py-4 sm:px-6">txnsByTradeUUIDState</div>
      </div>
    </>
  );
}
