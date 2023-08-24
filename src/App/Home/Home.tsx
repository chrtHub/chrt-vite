//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//

import Roadmap from "../../Roadmaps/Roadmaps";
import GettingStartedSteps from "./GettingStartedSteps";
import HowItWorks from "./HowItWorks";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Home() {
  return (
    <div className="mt-6 flex h-full w-full flex-col items-center justify-start gap-y-2 lg:mt-0">
      {/* Start of Welcome to CHRT */}
      <div className="mx-auto mt-6 w-full max-w-screen-2xl rounded-lg bg-zinc-100 px-6 py-6 dark:bg-zinc-800 lg:px-6">
        <div className="mx-auto mb-3 max-w-screen-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-700 dark:text-zinc-50 sm:text-4xl">
            Welcome to CHRT
          </h2>
          {/* Start of Line 1 */}
          <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-200">
            CHRT is currently in active development.
          </p>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-200">
            If you have feedback, please reach out to{" "}
            <span>
              <a
                className="text-green-700 dark:text-green-500"
                href="mailto:aaron@chrt.com"
              >
                aaron@chrt.com
              </a>
            </span>
          </p>
          {/* End of Line 1 */}
        </div>
      </div>
      {/* End of Welcome to CHRT */}

      {/* Start of  Getting Started Steps */}
      <div className="mt-6">
        <GettingStartedSteps />
      </div>
      {/* End of  Getting Started Steps */}

      {/* Start of Roadmap */}
      <div className="mt-6 w-full pb-6">
        <Roadmap />
      </div>
      {/* End of Roadmap */}
    </div>
  );
}
