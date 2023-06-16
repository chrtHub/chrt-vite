//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import CTA401Fallback from "./CTA401Fallback";
import { chrt_1 } from "./Layouts/Templates";

import PL_45_Days from "./Charts/PL_45_Days";

//-- NPM Components --//
import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./rgl-overrides.css";

//-- Icons --//
import {
  ArrowDownRightIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../Util/classNames";
import AGG_PL_45_Days from "./Charts/AGG_PL_45_Days";

//-- Data Objects, Environment Variables --//

const DraggableHandle = () => {
  return (
    <div
      className={classNames(
        "react-grid-dragHandle cursor-move",
        "absolute right-0 top-0 z-20 mr-1.5 mt-2.5 rounded-full p-2",
        "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800",
        "dark:text-zinc-300 dark:hover:bg-zinc-600 dark:hover:text-zinc-100"
      )}
    >
      <ArrowsPointingOutIcon
        className="h-5 w-5"
        style={{ transform: "rotate(45deg)" }}
      />
    </div>
  );
};

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

      {/* ----- Grid Layout ----- */}
      <div className="h-full w-full">
        <ResponsiveGridLayout
          style={{ transition: "none" }}
          className="layout"
          layouts={chrt_1}
          onLayoutChange={onLayoutChange}
          breakpoints={{ lg: 1024, md: 768, sm: 640, xs: 1, xxs: 0 }} //-- Matching Tailwind CSS --//
          rowHeight={30}
          cols={{ lg: 12, md: 12, sm: 4, xs: 4, xxs: 4 }} //-- Aribtrary --//
          // margin={{ lg: [10, 10] }}
          // containerPadding={{ lg: [10, 10] }}
          resizeHandles={["se"]}
          resizeHandle={
            <span
              className={classNames(
                "react-resize-handle cursor-se-resize",
                "absolute bottom-0 right-0 z-20 mb-2.5 mr-1.5 rounded-full p-2",
                "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800",
                "dark:text-zinc-300 dark:hover:bg-zinc-600 dark:hover:text-zinc-100"
              )}
            >
              <ArrowDownRightIcon className="h-5 w-5" />
            </span>
          }
          draggableHandle=".react-grid-dragHandle"
        >
          {/* ----- Start of Charts ----- */}
          {/* START OF PL_45_Days */}
          <div key="PL_45_Days" className="rounded-lg py-1">
            <PL_45_Days />
            <DraggableHandle />
          </div>
          {/* END OF PL_45_Days */}

          {/* START OF AGG_PL_45_DAYS */}
          <div key="AGG_PL_45_Days" className="rounded-lg py-1">
            <AGG_PL_45_Days />
            <DraggableHandle />
          </div>
          {/* END OF AGG_PL_45_DAYS */}

          {/* ----- End of Charts ----- */}
        </ResponsiveGridLayout>
      </div>
    </>
  );
}
