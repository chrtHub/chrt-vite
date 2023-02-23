import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

export default function EChart({ option, height, width }) {
  const chartRef = useRef(null);
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  let chartInstance = null;

  useEffect(() => {
    chartInstance = echarts.init(chartRef.current, darkMode ? "dark" : "light");
    chartInstance.setOption(option);

    window.addEventListener("resize", handleResize);

    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    matchMedia.addEventListener("change", handleThemeChange);
    return () => {
      chartInstance.dispose();
      window.removeEventListener("resize", handleResize);
      matchMedia.removeEventListener("change", handleThemeChange);
    };
  }, [option, darkMode]);

  function handleResize() {
    if (chartInstance) {
      chartInstance.resize();
    }
  }

  function handleThemeChange(event) {
    setDarkMode(event.matches);
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: width,
        height: height,
        backgroundColor: darkMode ? "#1d1d1d" : "white",
        color: darkMode ? "white" : "black",
      }}
    />
  );
}
