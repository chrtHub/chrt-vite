//-- react, react-router-dom, Auth0 --//
import { useState } from "react";

//-- TSX Components --//
import CTA401Fallback from "./CTA401Fallback";
import { chrt_1 } from "./Layouts/LayoutTemplates";

import PL_45_Days from "./PL_45_Days";

//-- NPM Components --//
import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import classNames from "../../Util/classNames";

//-- Icons --//
import {
  ArrowDownRightIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Journal() {
  //-- React State --//
  // const initialLayouts = localStorage.getItem("rgl") || {};
  // console.log("initialLayouts:", initialLayouts); // DEV

  // const [layouts, setLayouts] = useState(
  //   JSON.parse(JSON.stringify(initialLayouts))
  // );
  // console.log("layouts:", layouts); // DEV

  //-- Auth0 --//

  //-- Data Fetching --//

  //-- Other --//
  const ResponsiveGridLayout = WidthProvider(Responsive);

  //-- Handlers --//
  const onLayoutChange = (layout: {}, layouts: {}) => {
    console.log("onLayoutChange: ", layouts); // DEV
    // localStorage.setItem("rgl", JSON.stringify(layouts)); // todo
    // setLayouts(layouts);
  };

  // const resetLayout = () => {
  //   setLayouts({});
  // };

  //-- Side Effects --//

  return (
    <>
      <CTA401Fallback />

      {/* Grid Layout */}
      <div className="h-full w-full">
        <ResponsiveGridLayout
          className="layout"
          layouts={chrt_1}
          onLayoutChange={onLayoutChange}
          breakpoints={{ lg: 1024, md: 768, sm: 640, xs: 1, xxs: 0 }} //-- Matching Tailwind CSS --//
          cols={{ lg: 12, md: 12, sm: 4, xs: 4, xxs: 4 }} //-- Aribtrary --//
          // margin={{ lg: [10, 10] }}
          // containerPadding={{ lg: [10, 10] }}
          rowHeight={30}
          resizeHandles={["se"]}
          resizeHandle={
            <div
              className={classNames(
                "react-resizable-handle cursor-se-resize",
                "absolute bottom-0 right-0 mb-2 mr-2 rounded-full",
                "hover:bg-zinc-200"
              )}
            />
          }
          draggableHandle=".react-grid-dragHandle"
        >
          {/* START OF PL_45_DAYS */}
          <div key="a" className="rounded-lg py-1">
            <div className="react-grid-dragHandle bg-zing-900 absolute right-0 top-0 mr-2 mt-2 cursor-move rounded-full p-2 hover:bg-zinc-200">
              <ArrowsPointingOutIcon
                className="h-5 w-5"
                style={{ transform: "rotate(45deg)" }}
              />
            </div>
            <PL_45_Days />
          </div>
          {/* END OF PL_45_DAYS */}
        </ResponsiveGridLayout>
      </div>
    </>
  );
}

// resizeHandle={<div className="absolute bottom-0 right-0">foo</div>}
