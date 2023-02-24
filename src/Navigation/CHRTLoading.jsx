//-- react, react-router-dom, recoil, Auth0 --//

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//
import barChartEmoji from "../Assets/twemoji_bar_chart/android-chrome-192x192.png";

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function CHRTLoading() {
  //-- React State --//

  //-- Recoil State --//

  //-- Auth --//

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex h-full flex-row items-start justify-center">
      <img
        src={barChartEmoji}
        alt="bar chart emoji"
        width={192}
        height={192}
        className="mt-28 animate-pulse bg-transparent drop-shadow-xl"
      />
    </div>
  );
}
