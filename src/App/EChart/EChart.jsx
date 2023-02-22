//-- react, react-router-dom, recoil, Auth0 --//
import { useEffect, useRef } from "react";

//-- JSX Components --//

//-- NPM Components --//
import * as echarts from "echarts";

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function EChart({ option, height, width }) {
  //-- React State --//

  //-- Recoil State --//

  //-- Auth --//

  //-- Data Fetching --//

  //-- Other --//
  const chartRef = useRef(null);
  let chart = null;
  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  //-- Click Handlers --//

  //-- Side Effects --//
  useEffect(() => {
    //-- Initialize chart with provided 'option' object--//
    chart = echarts.init(chartRef.current);
    chart.setOption(option);

    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [option]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return <div ref={chartRef} style={{ width: width, height: height }} />;
}
