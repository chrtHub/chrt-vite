//-- react, react-router-dom, recoil, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

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
  const { user } = useAuth0();

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex h-full flex-row items-start justify-center">
      <img
        src={barChartEmoji}
        about={`user: ${user}`}
        alt="bar chart emoji"
        width={192}
        height={192}
        className="mt-28 animate-pulse bg-transparent drop-shadow-xl"
      />
    </div>
  );
}
