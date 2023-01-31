//-- React --//
import { useState } from "react";

//-- AWS SDK --//

//-- CHRT Components --//
import BackgroundGradientTop from "./BackgroundGradientTop";
import BackgroundGradientBottom from "./BackgroundGradientBottom";

//-- npm Package Functions --//
import { useAuth0 } from "@auth0/auth0-react";
import { Dialog } from "@headlessui/react";

//-- npm Package Components --//
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const VITE_HOMEPAGE_URL = import.meta.env.VITE_HOMEPAGE_URL;

const navigation = [
  {
    name: "Trading Journal",
    href: VITE_HOMEPAGE_URL + "/journal",
  },
  {
    name: "Market Data",
    href: VITE_HOMEPAGE_URL + "/data/AAPL",
  },
  { name: "About", href: "https://resources.chrt.com" },
];

export default function Hero() {
  const { loginWithRedirect } = useAuth0();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="isolate bg-white">
      <BackgroundGradientTop />

      {/* APP BAR */}
      <div className="px-6 pt-6 lg:px-8">
        <nav className="flex items-center justify-between" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href={`${VITE_HOMEPAGE_URL}`} className="-m-1.5 p-1.5">
              <span className="sr-only">CHRT</span>
              {/* LOGO */}
              <img
                className="h-8"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
          </div>

          {/* MOBILE MENU */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* NAVIGATION ITEMS */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* SIGN IN BUTTON */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => {
                loginWithRedirect();
              }}
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* DIALOG */}
        <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <Dialog.Panel
            focus="true"
            className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              {/* LOGO */}
              <a href={`${VITE_HOMEPAGE_URL}`} className="-m-1.5 p-1.5">
                <span className="sr-only">CHRT</span>
                <img
                  className="h-8"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              {/* CLOSE MENU BUTTON */}
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            {/* NAVIGATION ITEMS */}
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                {/* SIGN IN BUTTON */}
                <div className="py-6">
                  <a
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10 cursor-pointer"
                    onClick={() => {
                      loginWithRedirect();
                    }}
                  >
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>

      {/* MAIN */}
      <main>
        <div className="relative py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* TITLE & SUBTITLE */}
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Journal Your Day Trades
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Upload your brokerage files and see analysis of your trading
                peformance
              </p>
              {/* BUTTONS */}
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get Started
                </a>
                {/* <a
                  href="#"
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a> */}
              </div>
            </div>
            {/* SCREENSHOT */}
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="https://tailwindui.com/img/component-images/project-app-screenshot.png"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>

          <BackgroundGradientBottom />
        </div>
      </main>
    </div>
  );
}
