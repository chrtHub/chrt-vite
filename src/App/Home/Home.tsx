//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//

import FeatureSection from "./FeatureSection";
import HowItWorks from "./HowItWorks";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-y-3">
      <FeatureSection />

      {/* DEV */}
      {/* <HowItWorks /> */}
    </div>
  );
}
