//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useJournalContext } from "../../../Context/JournalContext";
import { useSiteContext } from "../../../Context/SiteContext";
//-- TSX Components --//
import EChart from "../../ECharts/EChart";
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios, { AxiosError } from "axios";
import { format, parseISO } from "date-fns";
import numeral from "numeral";

//-- Utility Functions --//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { DateAndProfitRow, PL45DayRow } from "../Types/journal_types";
import { zinc } from "../../../Util/TailwindPalette";
import EChartWrapperWithFallback from "../../ECharts/EChartWrapperWithFallback";
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//

export default function PL_45_Days() {
  //-- React State --//
  // TODO - implement FUED
  // fetched
  // updating
  const [loading, setLoading] = useState<boolean>(false);
  let JournalContext = useJournalContext();
  let SiteContext = useSiteContext();

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [ECharts options] --//
  const height = "300px";
  const width = "100%";
  const option = {
    backgroundColor: SiteContext.theme === "light" ? zinc._50 : zinc._800,
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
          backgroundColor: "#71717a", //-- zinc 500 --//
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
    <EChartWrapperWithFallback
      title="Profit & Loss, Trading Days in Past 45 Calendar Days"
      loading={loading}
      height={height}
      width={width}
    >
      <EChart option={option} height={height} width={width} />
    </EChartWrapperWithFallback>
  );
}