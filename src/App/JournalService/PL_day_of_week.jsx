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
          show: false, // REMOVE TO SHOW AXIS POINTER LABELS
          backgroundColor: "#6a7985",
          formatter: function (params) {
            let data = params.seriesData?.data;

            if (data && data[0] && data[1]) {
              if (params.axisDimension === "x") {
                let date = parseISO(data[0]);
                let dateFormatted = format(date, "MMM dd");
                return `${dateFormatted}`;
              } else {
                let profit = parseFloat(data[1]);
                let profitFormatted = numeral(profit).format("$0,0.00");
                return `${profitFormatted}`;
              }
            } else {
              return null;
            }
          },
        },
      },
      formatter: function (params) {
        const data = params[0].data;

        const date = parseISO(data[0]);
        const dateFormatted = format(date, "MMM dd");

        const profit = parseFloat(data[1]);
        const profitFormatted = numeral(profit).format("$0,0.00");

        return `${dateFormatted}: ${profitFormatted}`;
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
        itemStyle: {
          normal: {
            color: function (params) {
              const profit = params.data[1];
              if (profit >= 0) {
                return "#4ade80"; // green 400
              } else {
                return "#ef4444"; // red 500
              }
            },
          },
        },
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
