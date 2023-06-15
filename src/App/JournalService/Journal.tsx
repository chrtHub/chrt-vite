//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import CTA401Fallback from "./CTA401Fallback";

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

  //-- Auth0 --//

  //-- Data Fetching --//

  //-- Other --//
  const ResponsiveGridLayout = WidthProvider(Responsive);

  let layouts = [{}];

  //-- Click Handlers --//

  //-- Side Effects --//

  return (
    <>
      <CTA401Fallback />

      {/* Grid Layout */}
      <div className="h-full w-full">
        <ResponsiveGridLayout
          className="layout"
          // layouts={}
          cols={{ lg: 12, md: 8, sm: 4, xs: 4, xxs: 4 }}
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
          <div
            key="a"
            data-grid={{
              x: 0,
              y: 0,
              w: 12,
              h: 8,
              minW: 4,
              minH: 6,
            }}
            className="rounded-lg py-1"
          >
            <div className="react-grid-dragHandle bg-zing-900 absolute right-0 top-0 mr-2 mt-2 cursor-move rounded-full p-2 hover:bg-zinc-200">
              <ArrowsPointingOutIcon
                className="h-5 w-5"
                style={{ transform: "rotate(45deg)" }}
              />
            </div>
            <PL_45_Days />
          </div>
        </ResponsiveGridLayout>
      </div>
    </>
  );
}

// resizeHandle={<div className="absolute bottom-0 right-0">foo</div>}
