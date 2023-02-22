//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//
import EChart from "../EChart/EChart";

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";
import { format } from "date-fns";

//-- Utility Functions --//
import getTradingDatesAndProfitsArray from "./getTradingDatesAndProfitsArray";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//-- Data Objects, Environment Variables --//
import { journalPL45DaysState } from "./atoms";
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function PL_day_of_week() {
  //-- React State --//
  const [loading, setLoading] = useState();

  //-- Recoil State --//
  const [journalPL45Days, setJournalPL45Days] =
    useRecoilState(journalPL45DaysState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Data Fetching --//

  //-- Other [ECharts options] --//
  let option_pl_last_45_days = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    xAxis: {
      data: journalPL45Days.days,
      inverse: true,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Quantity",
        type: "bar",
        data: journalPL45Days.profits,
      },
    ],
    animation: false,
  };

  //-- Click Handlers --//

  //-- Side Effects --//
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        //-- Get access token from memory or request new token --//
        let accessToken = await getAccessTokenSilently();

        //-- pl_last_45_calendar_days --//
        let res = await axios.get(
          `${VITE_ALB_BASE_URL}/journal/dashboard/pl_last_45_calendar_days`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        //-- Get array of trading dates from the past 45 calendar days --//
        const datesArray = getTradingDatesAndProfitsArray(45);

        //-- For valid trading days, use data returned from Postgres --//
        res.data.forEach((item) => {
          const date = format(new Date(item.trade_date), "yyyy-MM-dd");
          const index = datesArray.findIndex((x) => x.date === date);
          if (index !== -1) {
            datesArray[index].profit = item.profit;
          }
        });

        let dates = datesArray.map((x) => {
          return x.date;
        });
        let profits = datesArray.map((x) => {
          return x.profit;
        });

        setJournalPL45Days({
          dates: dates,
          profits: profits,
        });
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    fetchData();
  }, [getAccessTokenSilently]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div
      className={classNames(
        loading ? "" : "bg-white dark:bg-zinc-900",
        "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg text-black shadow dark:divide-zinc-600  dark:text-white"
      )}
    >
      <p className="">Profit & Loss, Trading Days in Past 45 Calendar Days</p>
      <EChart option={option_pl_last_45_days} height={"400px"} width={"100%"} />
    </div>
  );
}
