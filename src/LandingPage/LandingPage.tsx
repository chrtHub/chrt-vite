//-- react, react-router-dom, Auth0 --//
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import GettingStartedSteps from "../App/Home/GettingStartedSteps";
import Roadmap from "../Roadmaps/Roadmaps";
import Footer from "./Hero/Footer";

//-- NPM Components --//
import ReactPlayer from "react-player";

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../Util/classNames";

//-- Data Objects --//
import { DARK_THEME_BG, LIGHT_THEME_BG } from "../Layout/Theme";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {}
export default function LandingPage({}: IProps) {
  //-- Detect theme value (a) set in localStorage, or (b) from OS theme --//
  let dark = false;
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    dark = true;
  }
  const [darkMode, setDarkMode] = useState(dark);

  //-- Listed for OS theme changes --//
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches }) => {
      //-- Only react to OS theme changes if no 'theme' value is set in localStorage --//
      if (!("theme" in localStorage)) {
        if (matches) {
          setDarkMode(true);
        } else {
          setDarkMode(false);
        }
      }
    });

  //-- Send user to the "Sign Up" version of the universal login page instead of the "Sign In" version --//
  const { loginWithRedirect } = useAuth0();
  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* START OF APP BAR */}
      <div
        id="landing-page-app-bar"
        className={classNames(
          `${LIGHT_THEME_BG} ${DARK_THEME_BG}`,
          "sticky top-0 w-full max-w-7xl self-center px-6 pb-3 pt-6 lg:px-8",
          "border-b-2 dark:border-zinc-800"
        )}
      >
        <div className="flex items-center justify-between">
          {/* START OF APP BAR LHS */}
          <div className="flex lg:flex-1">
            <a href={`${window.location.origin}`} className="-m-1.5 p-1.5">
              <span className="sr-only">CHRT</span>
              <p className="z-10 h-8 w-auto font-sans text-3xl font-semibold text-black hover:text-green-500 dark:text-white dark:hover:text-green-500">
                chrt
              </p>
            </a>
          </div>
          {/* END OF APP BAR LHS */}

          {/* START OF APP BAR RHS */}
          <div className="lg:flex lg:flex-1 lg:justify-end">
            <button
              className={classNames(
                "rounded-md bg-zinc-500 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500",
                "dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus-visible:outline-zinc-700"
              )}
              onClick={() => {
                loginWithRedirect({
                  appState: {
                    returnTo: window.location.pathname,
                  },
                });
              }}
            >
              Sign In
            </button>
          </div>
          {/* END OF APP BAR RHS */}
        </div>
      </div>
      {/* END OF APP BAR */}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* START OF TITLE & SUBTITLE */}
        <div className="mx-auto max-w-2xl pt-3 text-center">
          <h1
            className={classNames(
              "text-4xl font-bold tracking-tight  sm:text-6xl",
              "text-zinc-900 dark:text-white"
            )}
          >
            Journal Your Day Trades
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-white">
            Upload your brokerage files and see analysis of your trading
            performance
          </p>
          {/* START OF BUTTONS */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={handleSignUp}
              className={classNames(
                "rounded-md bg-green-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
                "dark:bg-green-700 dark:hover:bg-green-600 dark:focus-visible:outline-green-700"
              )}
            >
              Sign Up - Free Preview
            </button>
          </div>

          <p className="mb-2 mt-12 italic text-zinc-600 dark:text-zinc-300">
            Video Demo: Creating a CHRT Account and Accessing the Site for Free
          </p>

          {/* END OF BUTTONS */}
        </div>
        {/* END OF TITLE & SUBTITLE */}

        {/* START OF BORDERED AREA */}
        <div className="flow-root">
          <div className="rounded-xl bg-zinc-900/5 p-2 ring-1 ring-inset ring-zinc-900/10 dark:bg-zinc-200/20 dark:ring-zinc-200/10 lg:rounded-2xl lg:p-4">
            <div className="flex aspect-video flex-row items-center justify-center">
              <ReactPlayer
                url="https://youtu.be/KHHY7zAq3Ew"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
        {/* END OF BORDERED AREA */}
      </div>

      <div className="max-w-7xl self-center px-6 lg:px-8">
        <GettingStartedSteps />
      </div>

      <div className=" min-w-7xl self-center px-6 py-12 lg:px-8">
        <Roadmap />
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
