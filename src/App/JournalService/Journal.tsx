//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import CTA401Fallback from "./CTA401Fallback";

import PL_45_Days from "./PL_45_Days";

//-- NPM Components --//
import { Responsive, WidthProvider } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

//-- Icons --//

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
      <div className="h-full w-full bg-zinc-100">
        <ResponsiveGridLayout
          className="layout"
          cols={{ lg: 12, md: 8, sm: 4, xs: 4, xxs: 4 }}
          rowHeight={30}
        >
          <div
            key="a"
            data-grid={{
              x: 0,
              y: 0,
              w: 12,
              h: 6,
              minW: 4,
              minH: 6,
            }}
            className="rounded-lg bg-emerald-200 py-1"
          >
            <PL_45_Days />
          </div>

          <div
            key="b"
            data-grid={{ x: 0, y: 0, w: 8, h: 8, minW: 4, minH: 4 }}
            className="rounded-lg bg-pink-200 py-1"
          >
            b
          </div>
          <div
            key="c"
            data-grid={{ x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 4 }}
            className="rounded-lg bg-pink-200 py-1"
          >
            c
          </div>
        </ResponsiveGridLayout>
      </div>
    </>
  );
}
