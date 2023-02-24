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
import { format, parseISO } from "date-fns";
import numeral from "numeral";

//-- Utility Functions --//
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
      formatter: function (params) {
        const data = params[0].data;

        const date = parseISO(data[0]);
        const dateStr = format(date, "MMM dd");

        const value = parseFloat(data[1]);
        const valueStr = numeral(value).format("$0,0.00");
        // const valueStr = value.toFixed(2);

        return `${dateStr}: ${valueStr}`;
      },
    },
    xAxis: {
      type: "time",
      axisLabel: {
        formatter: function (x) {
          return format(new Date(x), "MMM dd");
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: function (x) {
          let valueStr = numeral(x).format("$0,0.00");
          return `${valueStr}`;
        },
      },
    },
    series: [
      {
        name: "Quantity",
        type: "bar",
        data: journalPL45Days,
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
        let data = res.data;

        //-- Make array for dates and profits --//
        let datesAndProfits = data.map((x) => {
          return [x.date, x.profit];
        });
        let reversedDatesAndProfits = datesAndProfits.reverse();

        //-- Set Recoil state --//
        setJournalPL45Days(reversedDatesAndProfits);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [getAccessTokenSilently]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <>
      <p className="text-center">
        Profit & Loss, Trading Days in Past 45 Calendar Days
      </p>
      <EChart option={option_pl_last_45_days} height={"400px"} width={"100%"} />
    </>
  );
}

//   className={classNames(
//     loading ? "" : "bg-white dark:bg-zinc-900",
//     "mt-2 divide-y divide-zinc-200 overflow-hidden rounded-lg text-black shadow dark:divide-zinc-600  dark:text-white"
//   )}
// >
