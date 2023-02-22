import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function EChart({ option, height, width }) {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(option);

    window.addEventListener("resize", handleResize);

    return () => {
      chartInstance.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [option]);

  function handleResize() {
    if (chartInstance) {
      chartInstance.resize();
    }
  }

  return <div ref={chartRef} style={{ width: width, height: height }} />;
}
