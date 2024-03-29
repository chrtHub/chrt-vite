//-- react, react-router-dom, Auth0 --//
import { Fragment, useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

//-- TSX Components --//
import Conversations from "../App/GPT/Sidebar/Conversations";
import SignOutModal from "./SignOutModal";
import InfoPagesNav from "../Info/InfoPagesNav";

//-- NPM Components --//
import { Dialog, Transition } from "@headlessui/react";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//-- Icons --//
// import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  Bars3BottomLeftIcon,
  ChartBarSquareIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ExclamationTriangleIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../Util/classNames";

//-- Data Objects, Environment Variables --//
import chartLogo from "../Assets/twemoji_bar_chart/android-chrome-192x192.png";
import { DARK_THEME_BG, LIGHT_THEME_BG } from "../Layout/Theme";
import MainMenu from "./MainMenu";
import Layouts from "../App/JournalService/Sidebar/Layouts";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AppLayout() {
  //== React State ==//
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState<boolean>(false);

  //-- Synchronize with current pathname: (1) highlighted nav item, (2) secondary items in sidebar --//
  const { pathname } = useLocation();

  //-- When showing infoModePages, scroll to top of page whenever pathname changes --//
  const infoPagesPaths = [
    "/support",
    "/terms",
    "/privacy",
    "/cookies",
    "/system_requirements",
    "/oauth2_google",
    "/faq",
  ];

  const [infoPagesMode, setInfoPagesMode] = useState<boolean>(
    infoPagesPaths.includes(pathname)
  );

  useEffect(() => {
    setInfoPagesMode(infoPagesPaths.includes(pathname));
  }, [pathname]);

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      const rhsDiv = document.getElementById("rhs-div");
      rhsDiv?.scrollTo({ top: 0, behavior: "auto" });
    }, [pathname]);

    return null;
  };

  //--- Navigation Items --//
  interface INavigationItem {
    name: string;
    to: string;
    icon: React.ComponentType<any>;
  }
  let navigationItems: INavigationItem[] = [
    { name: "Home", to: "/", icon: HomeIcon },
    { name: "ChrtGPT", to: "/gpt", icon: ChatBubbleLeftRightIcon },
    { name: "Journal", to: "/journal", icon: ChartBarSquareIcon },
    { name: "Journal Files", to: "/journal_files", icon: FolderIcon },
  ];
  const pathMatchForNavItems = pathname.match(/^\/([^/]+)/)?.[0] || "/";

  //-- *********** Component Return ************** --//
  return (
    <>
      {infoPagesMode && <ScrollToTop />}
      <div
        id="app-layout-top-level-div"
        //-- With use of 'overflow-hidden', scroll behavior is to be handles by Outlet components (?) --//
        className={classNames(
          `${DARK_THEME_BG} ${LIGHT_THEME_BG}`,
          "fixed h-full w-full overflow-hidden overscroll-none"
        )}
      >
        {/* START OF CONFIRM SIGN OUT MODAL */}
        <SignOutModal
          signOutModalOpen={signOutModalOpen}
          setSignOutModalOpen={setSignOutModalOpen}
        />
        {/* END OF CONFIRM SIGN OUT MODAL */}

        {/* START OF TOAST CONTAINER */}
        <ToastContainer
          role="alert" //-- aria --//
          icon={<ExclamationTriangleIcon className="text-amber-500" />}
          position="top-right"
          autoClose={5000}
          closeOnClick
          pauseOnHover
          pauseOnFocusLoss
          className={"z-20 mt-11"}
          toastClassName={"dark:bg-zinc-800 dark:text-zinc-100"}
          progressClassName={"bg-amber-500 dark:bg-amber-500"}
          closeButton={({ closeToast }) => {
            return (
              <div
                onClick={closeToast}
                className="flex flex-col justify-start text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-200"
              >
                <XCircleIcon className="ml-1 mt-1 h-5 w-5" />
              </div>
            );
          }}
          transition={Slide}
          limit={3}
          theme={"colored"}
        />
        {/* END OF TOAST CONTAINER */}

        {/* START OF MOBILE SIDEBAR */}
        <Transition.Root show={mobileSidebarOpen} as={Fragment}>
          <Dialog
            id="app-layout-mobile-sidebar"
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileSidebarOpen}
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
              <div className="fixed inset-0 bg-zinc-400 bg-opacity-50 dark:bg-zinc-700 dark:bg-opacity-50" />
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
                <Dialog.Panel
                  className={classNames(
                    `${DARK_THEME_BG} ${LIGHT_THEME_BG}`,
                    "flex w-full max-w-sm flex-col justify-start pb-4"
                  )}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-14 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 opacity-60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black dark:bg-zinc-700 dark:focus:ring-white"
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-zinc-700 dark:text-zinc-50"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* START OF CHRT LOGO AND NAME */}
                  <div className="ml-2 mt-2 pr-2 lg:pr-0">
                    <Link
                      to="/"
                      className="flex w-full flex-row items-center justify-start rounded-md pb-2 pl-2 pt-2 hover:bg-green-300 hover:dark:bg-green-900"
                    >
                      <img
                        src={chartLogo}
                        alt={"chart logo"}
                        className="h-8 w-8 shadow-md"
                      />
                      <p className="ml-2.5 text-3xl font-semibold text-zinc-600 dark:text-white">
                        chrt
                      </p>
                    </Link>
                  </div>
                  {/* END OF CHRT LOGO AND NAME */}

                  {/* START OF NAVIGATION ITEMS */}
                  <div className="mt-1 flex flex-col">
                    <nav className="flex-1 space-y-1 px-2">
                      {navigationItems.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          onClick={() => {
                            setMobileSidebarOpen(false);
                          }}
                          className={classNames(
                            pathMatchForNavItems === item.to //-- First param of pathname --//
                              ? "bg-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                              : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              pathMatchForNavItems === item.to //-- First param of pathname --//
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
                  {/* END OF NAVIGATION ITEMS */}

                  {/*-- START OF DIVIDER --*/}
                  <div
                    className={classNames(
                      "mx-2 mt-1.5 rounded-full border-t-2 border-zinc-300 dark:border-zinc-500"
                    )}
                    aria-hidden="true"
                  />
                  {/*-- END OF DIVIDER --*/}

                  {/* START OF SECONDARY ITEMS */}
                  <div
                    id="mobile-sidebar-secondary-items-list"
                    className="mx-2 my-1.5 flex-grow overflow-y-auto"
                  >
                    {pathname.startsWith("/gpt") && <Conversations />}
                    {pathname.startsWith("/journal") &&
                      !pathname.startsWith("/journal_") && <Layouts />}
                  </div>
                  {/* END OF SECONDARY ITEMS */}

                  {/* START OF MAIN MENU */}
                  <div className="z-30">
                    <MainMenu
                      setSignOutModalOpen={setSignOutModalOpen}
                      setMobileSidebarOpen={setMobileSidebarOpen}
                    />
                  </div>
                  {/* END OF MAIN MENU */}
                </Dialog.Panel>
              </Transition.Child>
              {/* SPACER FOR 'CLOSE' ICON */}
              <div className="w-16 flex-shrink-0" />
            </div>
          </Dialog>
        </Transition.Root>
        {/* END OF MOBILE SIDEBAR */}

        {/* START OF STATIC SIDEBAR */}
        <div
          id="app-layout-static-sidebar"
          className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col"
        >
          <div
            className={classNames(
              `flex h-full flex-col overflow-y-auto ${DARK_THEME_BG} ${LIGHT_THEME_BG}`
            )}
          >
            {/* START OF CHRT LOGO AND NAME */}
            <div className="ml-2 mt-2">
              <Link
                to="/"
                className="flex w-full flex-row items-center justify-start rounded-md pb-2 pl-2 pt-2 hover:bg-green-300 hover:dark:bg-green-900"
              >
                <img
                  src={chartLogo}
                  alt={"chart logo"}
                  className="h-8 w-8 shadow-md"
                />
                <p className="ml-2.5 text-3xl font-semibold text-zinc-600 dark:text-white">
                  chrt
                </p>
              </Link>
            </div>
            {/* END OF CHRT LOGO AND NAME */}

            {/* START OF NAVIGATION ITEMS */}
            <div className="mt-1 flex flex-col">
              <nav className="flex-1 space-y-1 pl-3">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={classNames(
                      pathMatchForNavItems === item.to //-- First param of pathname --//
                        ? "bg-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white",
                      "group flex items-center rounded-md px-2 py-1.5 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        pathMatchForNavItems === item.to //-- First param of pathname --//
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
            {/* END OF NAVIGATION ITEMS */}

            {/*-- START OF DIVIDER --*/}
            <div
              className={classNames(
                "ml-3 mt-1.5 rounded-full border-t-2 border-zinc-300 dark:border-zinc-500"
              )}
              aria-hidden="true"
            />
            {/*-- END OF DIVIDER --*/}

            {/* START OF SECONDARY ITEMS */}
            <div
              id="static-sidebar-secondary-items-list"
              className="my-1.5 ml-3 flex-grow overflow-y-auto"
            >
              {/* Secondary Items per Route */}
              {pathname.startsWith("/gpt") && <Conversations />}
              {pathname.startsWith("/journal") &&
                !pathname.startsWith("/journal_") && <Layouts />}
            </div>
            {/* END OF SECONDARY ITEMS */}

            {/* START OF MAIN MENU */}
            <div className="z-30">
              <MainMenu setSignOutModalOpen={setSignOutModalOpen} />
            </div>
            {/* END OF MAIN MENU */}
          </div>
        </div>
        {/* END OF STATIC SIDEBAR */}

        {/* START OF RHS */}
        <div
          id="app-layout-rhs-div"
          className="h-full overflow-y-auto overflow-x-hidden lg:pl-64"
        >
          {/* START OF TOP BAR (hidden after lg) */}
          <div id="spacer-for-top-bar" className="mt-12 lg:hidden" />
          <div
            className={classNames(
              "absolute top-0 z-30 w-full lg:hidden",
              "bg-zinc-50 dark:bg-zinc-900",
              "border-b-2 border-b-zinc-300 dark:border-b-zinc-600"
            )}
          >
            <div className="flex h-12 flex-row">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="flex items-center justify-center px-4 text-zinc-400 hover:text-zinc-500 lg:hidden"
              >
                <Bars3BottomLeftIcon className="h-7 w-7" aria-hidden="true" />
              </button>
            </div>
          </div>
          {/* END OF TOP BAR (hidden after lg) */}

          {/* START OF RHS CONTENT */}
          <div
            id="app-layout-rhs-content"
            className="mx-auto flex h-full max-w-screen-2xl flex-col px-2 lg:pl-2 lg:pr-4"
          >
            <main id="app-layout-react-router-Outlet" className="h-full">
              {infoPagesMode && <InfoPagesNav />}
              <Outlet />
            </main>
          </div>
          {/* END OF RHS CONTENT */}
        </div>
        {/* END OF RHS */}
      </div>
    </>
  );
}
