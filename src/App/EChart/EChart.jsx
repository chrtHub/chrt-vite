//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";

//-- JSX Components --//

//-- NPM Components --//
import * as echarts from "echarts";

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//
import { echartsThemeState } from "../../Layout/atoms.jsx";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function EChart({ option, height, width }) {
  //-- React State --//

  //-- Recoil State --//
  const echartsTheme = useRecoilValue(echartsThemeState);
  //-- Auth --//

  //-- Data Fetching --//

  //-- Other --//
  let chart = null;
  const chartRef = useRef(null);

  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };

  let currentTheme;

  //-- Click Handlers --//

  //-- Side Effects --//
  useEffect(() => {
    //-- Initialize chart with provided 'option' object--//
    chart = echarts.init(chartRef.current, echartsTheme);
    chart.setOption(option);

    //-- Listen for resize events --//
    window.addEventListener("resize", handleResize);

    //-- Cleanup --//
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [option, echartsTheme]);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return <div ref={chartRef} style={{ width: width, height: height }} />;
}

// let initialTheme;
// if (document.documentElement.classList.contains("dark")) {
//   initialTheme = "dark";
// } else {
//   initialTheme = "light";
// }
// const [theme, setTheme] = useState(initialTheme);

// const handleThemeChange = ({ matches }) => {
//   //-- Only react to OS theme changes if no 'theme' value is set in localStorage --//
//   if (!("theme" in localStorage)) {
//     if (matches) {
//       setTheme("dark");
//     } else {
//       setTheme("light");
//     }
//   }
// };

//    //-- Listen for OS theme changes --//
// window
//   .matchMedia("(prefers-color-scheme: dark)")
//   .addEventListener("change", handleThemeChange);

// window
// .matchMedia("(prefers-color-scheme: dark)")
// .removeEventListener("change", handleThemeChange);
