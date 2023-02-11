//-- React --//
import { useState } from "react";

//-- AWS SDK --//

//-- CHRT Components --//
import BackgroundGradientTop from "./BackgroundGradientTop";
import BackgroundGradientBottom from "./BackgroundGradientBottom";

import echartsBarchartExampleLight from "../../Assets/echarts/echarts-barchart-example-light.png";
// import echartsBarchartExampleDark from "../../Assets/echarts/echarts-barchart-example-dark.png";

//-- npm Package Functions --//
import { useAuth0 } from "@auth0/auth0-react";
// import { Dialog } from "@headlessui/react";

//-- npm Package Components --//
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// const VITE_HOMEPAGE_URL = import.meta.env.VITE_HOMEPAGE_URL;

// const navigation = [
//   {
//     name: "Trading Journal",
//     href: `${window.location.origin}/journal`,
//   },
//   {
//     name: "Market Data",
//     href: `${window.location.origin}/data`,
//   },
// ];

export default function Hero() {
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

  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <BackgroundGradientTop />
      {/* START OF APP BAR */}
      <div className="px-6 pt-6 lg:px-8">
        <nav className="flex items-center justify-between" aria-label="Global">
          <div className="flex lg:flex-1">
            {/* START OF LOGO */}
            <a href={`${window.location.origin}`} className="-m-1.5 p-1.5">
              <span className="sr-only">CHRT</span>
              <a
                href={window.location.origin}
                className="text- h-8 w-auto font-sans text-3xl font-semibold hover:text-green-500 dark:hover:text-green-500"
              >
                chrt
              </a>
            </a>
            {/* END OF LOGO */}
          </div>

          {/* MOBILE MENU */}
          {/* <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div> */}

          {/* NAVIGATION ITEMS */}
          <div className="hidden lg:flex lg:gap-x-12">
            {/* {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-zinc-900"
              >
                {item.name}
              </a>
            ))} */}
          </div>

          {/* SIGN IN BUTTON */}
          <div className="lg:flex lg:flex-1 lg:justify-end">
            <button
              className="text-sm font-semibold leading-6 text-black"
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
        </nav>

        {/* DIALOG */}
        {/* <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <Dialog.Panel
            focus="true"
            className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden"
          >
            <div className="flex items-center justify-between"> */}
        {/* LOGO */}
        {/* <a href={`${window.location.origin}`} className="-m-1.5 p-1.5">
                <span className="sr-only">CHRT</span>
                <a
                  href={window.location.origin}
                  className="h-8 w-auto font-sans text-3xl font-semibold text-zinc-900 hover:text-green-500 dark:hover:text-green-500"
                >
                  chrt
                </a>
              </a> */}
        {/* CLOSE MENU BUTTON */}
        {/* <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-zinc-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div> */}
        {/* NAVIGATION ITEMS */}
        {/* <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-zinc-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-400/10"
                    >
                      {item.name}
                    </a>
                  ))}
                </div> */}
        {/* SIGN IN BUTTON */}
        {/* <div className="py-6">
                  <a
                    className="-mx-3 block cursor-pointer rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-zinc-900 hover:bg-zinc-400/10"
                    onClick={() => {
                      loginWithRedirect({
                        appState: {
                          returnTo: window.location.pathname,
                        },
                      });
                    }}
                  >
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog> */}
      </div>
      {/* END OF APP BAR */}

      {/* START OF MAIN */}
      <main>
        <div className="relative py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* START OF TITLE & SUBTITLE */}
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
                Journal Your Day Trades
              </h1>
              <p className="mt-6 text-lg leading-8 text-zinc-600">
                Upload your brokerage files and see analysis of your trading
                peformance
              </p>
              {/* START OF BUTTONS */}
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-green-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Do a Demo
                </a>
                <button
                  onClick={handleSignUp}
                  className="rounded-md bg-zinc-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                >
                  Sign Up
                </button>
              </div>
              {/* END OF BUTTONS */}
            </div>
            {/* END OF TITLE & SUBTITLE */}

            {/* START OF SCREENSHOT */}
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-zinc-900/5 p-2 ring-1 ring-inset ring-zinc-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src={echartsBarchartExampleLight}
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl ring-1 ring-zinc-900/10"
                />
              </div>
            </div>
            {/* END OF SCREENSHOT */}
          </div>
          <BackgroundGradientBottom />
        </div>
      </main>
      {/* END OF MAIN */}
    </>
  );
}
