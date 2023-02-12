//-- react, react-router-dom, Auth0 --//
import { Fragment, useState } from "react";
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
  CalendarIcon,
  CalendarDaysIcon,
  ComputerDesktopIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  PresentationChartLineIcon,
  PresentationChartBarIcon,
  SunIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
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
export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentNavItem, setCurrentNavItem] = useState(
    window.location.pathname
  );

  //-- Auth0 --//
  const { logout, user } = useAuth0();

  //-- Theming - Light Mode, Dark Mode, Match OS Mode --//
  let theme = localStorage.getItem("theme");
  const [currentMode, setCurrentMode] = useState(theme);

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
    <div>
      {/* START OF MOBILE SIDEBAR */}
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
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
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
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <a
                    href={window.location.origin}
                    className="h-8 w-auto font-sans text-3xl font-semibold text-black hover:text-green-500 dark:text-white dark:hover:text-green-500"
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
                          setSidebarOpen(false);
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
            {/* SPACER FOR 'CLOSE' ICON */}
            <div className="w-14 flex-shrink-0" />
          </div>
        </Dialog>
      </Transition.Root>
      {/* END OF MOBILE SIDEBAR */}

      {/* START OF STATIC SIDEBAR */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <a
              href={window.location.origin}
              className="h-8 w-auto font-sans text-3xl font-semibold text-zinc-900 hover:text-green-500 dark:text-white dark:hover:text-green-500"
            >
              chrt
            </a>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
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
      {/* END OF STATIC SIDEBAR */}

      {/* START OF RHS */}
      <div className="md:pl-64">
        <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
          {/* START OF HAMBURGER BUTTON + SEARCH BAR + PROFILE PICTURE + DROPDOWN MENU */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
            {/* START OF HAMBURGER BUTTON */}
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* END OF HAMBURGER BUTTON */}

            {/* START OF SEARCH BAR + PROFILE PICTURE + DROPDOWN MENU */}
            <div className="flex flex-1 justify-between px-4 md:px-0">
              {/* START OF SEARCH BAR */}
              <div className="flex flex-1">
                <form className="flex w-full md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <MagnifyingGlassIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search-field"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                      placeholder="Search"
                      type="search"
                      name="search"
                    />
                  </div>
                </form>
              </div>
              {/*END OF SEARCH BAR  */}

              {/* START OF DROPDOWN MENU + PROFILE PICTURE*/}
              <div className="ml-4 flex items-center md:ml-6">
                {/* START OF DROPDOWN MENU */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    {/* START OF PROFILE PICTURE */}
                    <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      {user.picture ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.picture}
                          alt="profile image"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 rounded-full" />
                      )}
                    </Menu.Button>
                    {/* END OF PROFILE PICTURE */}
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                            href={`${window.location.origin}/terms`}
                            className={classNames(
                              active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                              "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                            )}
                          >
                            Terms, Privacy, FAQ, etc.
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
                {/* END OF DROPDOWN MENU */}
              </div>
              {/* END OF DROPDOWN MENU + PROFILE PICTURE*/}
            </div>
            {/* END OF SEARCH BAR + PROFILE PICTURE + DROPDOWN MENU */}
          </div>
          {/* START OF HAMBURGER BUTTON + SEARCH BAR + PROFILE PICTURE + DROPDOWN MENU */}

          {/* START OF MAIN */}
          <main className="flex-1">
            {/* <div className="py-6"> */}
            {/* <div className="px-4 sm:px-6 md:px-0"> */}
            <Outlet />
            {/* </div> */}
            {/* </div> */}
          </main>
          {/* END OF MAIN */}
        </div>
      </div>
      {/* END OF RHS */}
    </div>
  );
}
