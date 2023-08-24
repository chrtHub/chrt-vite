//-- react, react-router-dom, Auth0 --//
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import GettingStartedSteps from "../App/Home/GettingStartedSteps";
import Roadmaps from "../Roadmaps/Roadmaps";
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
        {/* START OF TITLE/SUBTITLE/BUTTON */}
        <div className="mx-auto max-w-2xl pt-10 text-center">
          <h1
            className={classNames(
              "text-4xl font-bold tracking-tight sm:text-6xl",
              "text-zinc-900 dark:text-white"
            )}
          >
            Journal Your Day Trades
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-white lg:text-xl">
            Upload your brokerage files to see analysis of your trading
            performance
          </p>
          {/* START OF BUTTON */}
          <div className="mt-8 flex items-center justify-center gap-x-6">
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
          {/* END OF BUTTON */}
        </div>
        {/* END OF TITLE/SUBTITLE/BUTTON */}
      </div>

      {/* Container */}
      <div className="mt-8 w-full max-w-7xl self-center px-6 lg:px-8">
        {/* Card */}
        <div className="my-2 w-full rounded-lg bg-zinc-200 p-5 dark:bg-zinc-700">
          {/* Title */}
          <h1 className="mb-3 text-center text-2xl font-bold text-zinc-700 dark:text-zinc-50 lg:text-3xl">
            Create an Account and Access the Free Preview
          </h1>
          <div className="flex aspect-video flex-row items-center justify-center">
            <ReactPlayer
              url={
                darkMode
                  ? "https://youtu.be/PW_yyotQSdE" //-- dark mode --//
                  : "https://youtu.be/eKPZmSY25zA" //-- light mode --//
              }
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 w-full max-w-7xl self-center px-6 lg:px-8">
        <GettingStartedSteps />
      </div>

      <div className="mt-12 w-full max-w-7xl self-center px-6 lg:px-8">
        <Roadmaps />
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
