//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useJournalContext } from "../../../Context/JournalContext";

//-- TSX Components --//
import EChart from "../../EChart/EChart";
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios, { AxiosError } from "axios";
import { format, parseISO } from "date-fns";
import numeral from "numeral";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { DateAndProfitRow, PL45DayRow } from "../Types/journal_types";
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//

export default function PL_45_Days() {
  //-- React State --//
  const [loading, setLoading] = useState<boolean>(false);
  let JournalContext = useJournalContext();

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [ECharts options] --//
  const option = {
    backgroundColor: "#3F3F46",
    grid: {
      left: "12",
      right: "12",
      top: "18",
      bottom: "0",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          show: false, //-- REMOVE TO SHOW AXIS POINTER LABELS --//
          backgroundColor: "#6a7985",
          formatter: function (params: any) {
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
      formatter: function (params: any) {
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
        rotate: 45,
        formatter: function (x: any) {
          return format(new Date(x), "MMM dd");
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: function (x: any) {
          let valueStr = numeral(x).format("$0,0");
          return `${valueStr}`;
        },
      },
    },
    series: [
      {
        name: "Quantity",
        type: "bar",
        data: JournalContext.pl45Days,
        itemStyle: {
          color: function (params: any) {
            const profit = params.data[1];
            if (profit >= 0) {
              return "#4ade80"; //-- green 400 --//
            } else {
              return "#ef4444"; //-- red 500 --//
            }
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
        let data: DateAndProfitRow[] = res.data;

        //-- Make array for dates and profits --//
        let datesAndProfits: PL45DayRow[] = data.map((x) => {
          return [x.date, x.profit];
        });
        let reversedDatesAndProfits = datesAndProfits.reverse();

        //-- Set state --//
        JournalContext.setPL45Days(reversedDatesAndProfits);
      } catch (err) {
        if (err instanceof AxiosError) {
          axiosErrorToaster(err);
        } else {
          console.log(err);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [getAccessTokenSilently]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="rounded-2xl bg-zinc-200 px-3 py-3 dark:bg-zinc-700 dark:text-zinc-100">
      <p className="mb-3 text-center font-medium">
        Profit & Loss, Trading Days in Past 45 Calendar Days
      </p>
      <div className="">
        <EChart option={option} height={"400px"} width={"100%"} />
      </div>
    </div>
  );
}
