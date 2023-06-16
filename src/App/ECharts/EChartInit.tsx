//-- react, react-router-dom, Auth0 --//
import { useEffect, useRef } from "react";
import { useSiteContext } from "../../Context/SiteContext";

//-- TSX Components --//

//-- NPM Components --//
import * as echarts from "echarts/core";
import {
  BarChart,
  // BarSeriesOption,
  // LineChart,
  // LineSeriesOption,
} from "echarts/charts";
import {
  TitleComponent,
  // TitleComponentOption,
  TooltipComponent,
  // TooltipComponentOption,
  GridComponent,
  // GridComponentOption,
  DatasetComponent,
  // DatasetComponentOption,
  TransformComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import classNames from "../../Util/classNames";
// type ECOption = echarts.ComposeOption<
//   | BarSeriesOption
//   | LineSeriesOption
//   | TitleComponentOption
//   | TooltipComponentOption
//   | GridComponentOption
//   | DatasetComponentOption
// >;
echarts.use([
  //-- Charts --//
  BarChart,
  //-- Components --//
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  //-- Features --//
  LabelLayout,
  UniversalTransition,
  //-- Renderers --//
  CanvasRenderer,
]);

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {
  option: {}; //-- ECharts options types are very poor :( --//
}
export default function EChartInit({ option }: IProps) {
  //-- React State --//
  let SiteContext = useSiteContext();

  //-- Auth --//

  //-- Data Fetching --//

  //-- Other --//
  let chart: echarts.ECharts | null = null;
  const chartRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  //-- Click Handlers --//

  //-- Side Effects --//
  useEffect(() => {
    //-- Initialize chart with provided 'option' object--//
    if (chartRef.current) {
      chart = echarts.init(chartRef.current, SiteContext.theme);
      chart.setOption(option);

      //-- Listen for container resize events --//
      const resizeObserver = new ResizeObserver(() => {
        console.log("resizing EChartInit (caused by container)"); // DEV
        handleResize();
      });
      resizeObserver.observe(chartRef.current);

      //-- Listen for window resize events --//
      window.addEventListener("resize", () => {
        console.log("resizing EChartInit (caused by window)"); // DEV
        handleResize();
      });

      //-- Cleanup --//
      return () => {
        chart?.dispose();
        if (chartRef.current) {
          resizeObserver.unobserve(chartRef.current);
        }
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [option, SiteContext.theme]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return <div ref={chartRef} style={{ height: `100%`, width: `100%` }} />;
}
