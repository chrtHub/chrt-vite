//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";

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
import { echartsThemeState } from "../../Layout/atoms.jsx";

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {
  option: {}; //-- ECharts options types are very poor :( --//
  height: string;
  width: string;
}
export default function EChart({ option, height, width }: IProps) {
  //-- React State --//

  //-- Recoil State --//
  const echartsTheme = useRecoilValue(echartsThemeState);

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
      chart = echarts.init(chartRef.current, echartsTheme);
      chart.setOption(option);

      //-- Listen for resize events --//
      window.addEventListener("resize", handleResize);

      //-- Cleanup --//
      return () => {
        chart?.dispose();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [option, echartsTheme]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return <div ref={chartRef} style={{ width: width, height: height }} />;
}
