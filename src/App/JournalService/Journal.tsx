//-- react, react-router-dom, Auth0 --//
import { useState, useMemo } from "react";

//-- TSX Components --//
import CTA401Fallback from "./CTA401Fallback";
import { useJournalContext } from "../../Context/JournalContext";
import PL_45_Days from "./Charts/PL_45_Days";
import StatsTable from "./Tables/StatsTable";
import { DraggableHandle } from "./Reuseable/DraggableHandle";

//-- NPM Components --//
import { WidthProvider, Responsive, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./rgl-overrides.css";

//-- Icons --//
import { ArrowDownRightIcon } from "@heroicons/react/24/solid";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../../Util/classNames";
import AGG_PL_45_Days from "./Charts/AGG_PL_45_Days";
import { chrt_1 } from "./Layouts/Template";

const ResponsiveGridLayout = WidthProvider(Responsive); //-- NOTE - don't call this inside the Journal component because its reference keeps changing and it will tangle with useJournalContext to cause an infinite render loop --//

//-- Data Objects, Environment Variables --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Journal() {
  //-- React State --//
  const JC = useJournalContext();

  // const initialLayouts = localStorage.getItem("rgl") || {};

  // const [layouts, setLayouts] = useState(
  //   JSON.parse(JSON.stringify(initialLayouts))
  // );

  // const onLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
  //   console.log("onLayoutChange, currentLayout: ", currentLayout); // DEV
  //   console.log("onLayoutChange, allLayouts: ", allLayouts); // DEV
  //   // localStorage.setItem("rgl", JSON.stringify(allLayouts)); // todo
  //   // setLayouts(allLayouts);
  // };

  //-- Auth0 --//

  //-- Data Fetching --//

  //-- Other --//

  //-- Handlers --//
  // const onResetLayouts = () => {
  //   JC.setLayouts(JC.defaultLayouts)
  // }

  //-- Side Effects --//

  return (
    <>
      <CTA401Fallback />

      {/* ----- Grid Layout ----- */}
      <div className="h-full w-full">
        <ResponsiveGridLayout
          style={{ transition: "none" }}
          className="layout"
          layouts={JC.layouts}
          // onLayoutChange={onLayoutChange}
          breakpoints={{
            lg: 1024, //-- 12 cols --//
            md: 768, //-- 12 cols --//
            sm: 640, //-- 4 cols --//
            xs: 1, //-- 4 cols --//
            xxs: 0, //-- 4 cols --//
          }} //-- Matching Tailwind CSS - but note that this is for the container, not the screen --//
          rowHeight={30}
          cols={{ lg: 12, md: 12, sm: 4, xs: 4, xxs: 4 }} //-- Aribtrary --//
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
          {/* ----- Start of Content ----- */}
          {/* START OF PL_45_Days */}
          <div key="PL_45_Days" className="rounded-lg">
            <PL_45_Days />
            <DraggableHandle />
          </div>
          {/* END OF PL_45_Days */}

          {/* START OF AGG_PL_45_DAYS */}
          <div key="AGG_PL_45_Days" className="rounded-lg">
            <AGG_PL_45_Days />
            <DraggableHandle />
          </div>
          {/* END OF AGG_PL_45_DAYS */}

          {/* START OF STATS TABLE */}
          <div key="StatsTable" className="rounded-lg">
            <StatsTable />
            <DraggableHandle />
          </div>
          {/* END OF STATS TABLE */}

          {/* ----- End of Content ----- */}
        </ResponsiveGridLayout>
      </div>
    </>
  );
}
