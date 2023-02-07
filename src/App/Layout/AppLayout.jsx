//-- react, react-router-dom, Auth0 --//
import { useState, Fragment, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//
import { Dialog, Menu, Transition } from "@headlessui/react";

//-- Icons --//
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  MoonIcon,
} from "@heroicons/react/20/solid";
import {
  Bars3BottomLeftIcon,
  BellIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ComputerDesktopIcon,
  PresentationChartLineIcon,
  PresentationChartBarIcon,
  FolderIcon,
  HomeIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
function classNames(...classes) {
  return classes.filter(Boolean).join(" "); //-- Tailwind helper --//
}

//-- Data Objects --//
const navigation = [
  { name: "Home", to: "/", icon: HomeIcon },
  { name: "Journal", to: "/journal", icon: CalendarDaysIcon },
  { name: "Journal Files", to: "/files", icon: FolderIcon },
  { name: "Market Data", to: "/data", icon: PresentationChartLineIcon },
];

const userNavigation = [
  { name: "Profile", to: "/profile" },
  { name: "Settings", to: "/settings" },
  //-- Items using 'onClick' method, not NavLink with 'to' prop
  //-- Light/Dark Mode buttons --//
  //-- Terms, Privacy, & More --//
  //-- Sign out button - also uses onClick --//
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentNavItem, setCurrentNavItem] = useState(
    window.location.pathname
  );

  let theme = localStorage.getItem("theme");
  const [currentMode, setCurrentMode] = useState(theme);

  const { logout } = useAuth0();

  const useManualDarkMode = () => {
    //-- Set theme to dark in localStorage --//
    localStorage.setItem("theme", "dark");
    //-- Update theme to dark mode --//
    document.documentElement.classList.add("dark");
    //-- Update currentMode --//
    setCurrentMode("dark");
  };

  const useOSTheme = () => {
    //-- Remove theme from localStorage --//
    localStorage.removeItem("theme");
    //-- Update theme to match current OS theme --//
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    //-- Update currentMode --//
    setCurrentMode(null);
  };

  const useManualLightMode = () => {
    //-- Set theme to light in localStorage --//
    localStorage.setItem("theme", "light");
    //-- Update theme to light mode --//
    document.documentElement.classList.remove("dark");
    //-- Update currentMode --//
    setCurrentMode("light");
  };

  return (
    <>
      <div className="h-full bg-zinc-100 dark:bg-zinc-700">
        {/* Mobile Sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 dark:bg-zinc-600" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-zinc-200 pt-5 pb-4 dark:bg-zinc-800">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-black dark:text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <a
                      href={window.location.origin}
                      className="h-8 w-auto font-sans text-3xl font-semibold text-black dark:text-white "
                    >
                      chrt
                    </a>
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          onClick={() => {
                            setCurrentNavItem(item.to);
                          }}
                          className={classNames(
                            item.to === currentNavItem
                              ? "bg-zinc-300 text-zinc-900 dark:bg-zinc-900 dark:text-white"
                              : "hover:text-zinc:800 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.to === currentNavItem
                                ? "text-zinc-800 dark:text-zinc-300"
                                : "text-zinc-900 group-hover:text-zinc-600  dark:text-zinc-400 dark:group-hover:text-zinc-300",
                              "mr-4 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-zinc-200 dark:bg-zinc-800">
            <div
              className={`flex h-16 flex-shrink-0 items-center bg-zinc-300 px-4 dark:bg-zinc-900`}
            >
              <a
                href={window.location.origin}
                className="h-8 w-auto font-sans text-3xl font-semibold text-zinc-900 dark:text-white "
              >
                chrt
              </a>
            </div>
            {/* Nav items below */}
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={() => {
                      setCurrentNavItem(item.to);
                    }}
                    className={classNames(
                      item.to === currentNavItem
                        ? "bg-zinc-300 text-zinc-900 dark:bg-zinc-900 dark:text-white"
                        : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.to === currentNavItem
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-700 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col  md:pl-64">
          {/* Hamburger button */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow dark:bg-zinc-800">
            <button
              type="button"
              className="border-r border-zinc-300 px-4 text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 dark:border-zinc-600 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1">
                {/*  */}
                <form className="flex w-full md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-zinc-600 focus-within:text-zinc-800 dark:text-zinc-400  dark:focus-within:text-white">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <MagnifyingGlassIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search-field"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-zinc-900 placeholder-zinc-500 focus:border-transparent focus:placeholder-zinc-400 focus:outline-none focus:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 dark:focus:placeholder-zinc-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                      name="search"
                    />
                  </div>
                </form>
              </div>
              {/*  */}
              <div className="ml-4 flex items-center md:ml-6">
                {/* <button
                  type="button"
                  className="rounded-full bg-white p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-500 dark:focus:ring-zinc-500">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon className="h-8 w-8 rounded-full" />
                      {/* <img
                        className="h-8 w-8 rounded-full"
                        src=""
                        alt="profile image"
                      /> */}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-900 dark:ring-zinc-500">
                      {/* Light/Dark Mode Button - uses onClick isntead of href */}
                      <Menu.Item key={"light-dark-mode-button"}>
                        {({ active }) => (
                          <a
                            className={classNames(
                              active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                              "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                            )}
                          >
                            <span className="isolate inline-flex rounded-md shadow-sm">
                              <button
                                type="button"
                                onClick={useManualLightMode}
                                className={classNames(
                                  currentMode === "light"
                                    ? "bg-zinc-700 text-white"
                                    : "bg-white text-zinc-700",
                                  "relative inline-flex items-center rounded-l-md border border-zinc-300 px-4 py-2 text-sm font-medium  hover:bg-zinc-300 focus:z-10  focus:outline-none "
                                )}
                              >
                                <span className="sr-only">Light Mode</span>
                                <SunIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                type="button"
                                onClick={useOSTheme}
                                className={classNames(
                                  !currentMode
                                    ? "bg-zinc-700 text-white"
                                    : "bg-white text-zinc-700",
                                  "relative -ml-px inline-flex items-center border border-zinc-300 px-4 py-2 text-sm font-medium  hover:bg-zinc-300 focus:z-10  focus:outline-none "
                                )}
                              >
                                <span className="sr-only">Match OS Mode</span>
                                <ComputerDesktopIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                type="button"
                                onClick={useManualDarkMode}
                                className={classNames(
                                  currentMode === "dark"
                                    ? "bg-zinc-700 text-white"
                                    : "bg-white text-zinc-700",
                                  "relative -ml-px inline-flex items-center rounded-r-md border border-zinc-300 px-4 py-2 text-sm font-medium  hover:bg-zinc-300 focus:z-10  focus:outline-none "
                                )}
                              >
                                <span className="sr-only">Dark Mode</span>
                                <MoonIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                            </span>
                          </a>
                        )}
                      </Menu.Item>

                      {/* Buttons mapped from user navigation array */}
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <NavLink
                              to={item.to}
                              onClick={() => setCurrentNavItem(item.to)}
                              className={classNames(
                                active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                                "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                              )}
                            >
                              {item.name}
                            </NavLink>
                          )}
                        </Menu.Item>
                      ))}

                      {/* Terms, Privacy, & More */}
                      <Menu.Item key={"sign-out-button"}>
                        {({ active }) => (
                          <a
                            href={`${window.location.origin}/info`}
                            className={classNames(
                              active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                              "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                            )}
                          >
                            Terms, Privacy, & More
                          </a>
                        )}
                      </Menu.Item>

                      {/* Sign Out Button  */}
                      <Menu.Item key={"sign-out-button"}>
                        {({ active }) => (
                          <a
                            onClick={() => {
                              logout({
                                logoutParams: {
                                  returnTo: window.location.origin,
                                },
                              });
                            }}
                            className={classNames(
                              active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                              "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                            )}
                          >
                            Sign Out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          {/* While auth is loading, show <Loading />, then show <Outlet /> content */}

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
