//-- react, react-router-dom, Auth0 --//
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useJournalContext } from "../../../Context/JournalContext";
import { useSiteContext } from "../../../Context/SiteContext";
import { useErrorBoundary } from "react-error-boundary";

//-- TSX Components --//
import EChartInit from "../../ECharts/EChartInit";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";
import { format, parseISO } from "date-fns";
import numeral from "numeral";

//-- Utility Functions --//
import { throwAxiosError } from "../../../Errors/throwAxiosError"; // DEV

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { DateAndProfitRow, PL45DayRow } from "../Types/journal_types";
import { zinc, green } from "../../../Util/TailwindPalette";
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AGG_PL_45_Days_Config() {
  //== React State, Custom Hooks ==//
  let JC = useJournalContext();
  let SC = useSiteContext();
  const { showBoundary } = useErrorBoundary();

  //== Auth ==//
  const { getAccessTokenSilently } = useAuth0();

  //== Other [ECharts options] ==//
  const option = {
    backgroundColor: SC.theme === "light" ? zinc._50 : zinc._800,
    grid: {
      left: "12",
      right: "12",
      top: "12",
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
        type: "line",
        data: JC.aggPL45Days,
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

  //== Side Effects ==//

  //== Handlers ==//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return <EChartInit option={option} />;
}
