//-- react, react-router-dom, Auth0 --//
import { useJournalContext } from "../../../Context/JournalContext";
import { useSiteContext } from "../../../Context/SiteContext";

//-- TSX Components --//
import EChartInit from "../Reuseable/EChartInit";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import { format, parseISO } from "date-fns";
import numeral from "numeral";

//-- Utility Functions --//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { zinc, green, red, rose } from "../../../Util/TailwindPalette";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AGG_PL_45_Days_Config() {
  //== React State, Custom Hooks ==//
  let JC = useJournalContext();
  let SC = useSiteContext();

  //== Auth ==//

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
          let valueStr = numeral(x).format("$0,0a");
          return `${valueStr}`;
        },
      },
    },
    series: [
      {
        name: "Quantity",
        type: "line",
        data: JC.aggPL45Days,
        lineStyle: {
          color: SC.theme === "light" ? zinc._500 : zinc._50,
          width: 3,
          opacity: 0.5,
        },
        itemStyle: {
          color: function (params: any) {
            const profit = params.data[1];
            if (profit == 0) {
              return SC.theme === "light" ? zinc._500 : zinc._200;
            } else if (profit > 0) {
              return green._500;
            } else {
              return red._500;
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
