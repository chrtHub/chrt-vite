//-- react, react-router-dom, Auth0 --//
import { useState, useEffect, useRef } from "react";
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
  height: string;
  width: string;
}
export default function EChart({ option, height, width }: IProps) {
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
      chart = echarts.init(
        chartRef.current,
        SiteContext.eChartsTheme || undefined
      );
      chart.setOption(option);

      //-- Listen for resize events --//
      window.addEventListener("resize", handleResize);

      //-- Cleanup --//
      return () => {
        chart?.dispose();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [option, SiteContext.eChartsTheme]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return <div ref={chartRef} style={{ width: width, height: height }} />;
}
