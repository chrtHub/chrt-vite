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

  //-- Click Handlers --//

  //-- Side Effects --//
  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [option]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return <div ref={chartRef} style={{ width: width, height: height }} />;
}
