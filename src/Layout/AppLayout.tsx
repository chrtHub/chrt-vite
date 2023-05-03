//-- react, react-router-dom, recoil, Auth0 --//
import { Fragment, useMemo, useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useConversationsContext } from "../Context/ConversationsContext";
import { useChatContext } from "../Context/ChatContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState } from "recoil";

//-- TSX Components --//
import getConversationsList from "../App/GPT/chatson/getConversationsList";

//-- NPM Components --//
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Virtuoso } from "react-virtuoso";
//-- Icons --//
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  MoonIcon,
} from "@heroicons/react/20/solid";
import {
  Bars3BottomLeftIcon,
  CalendarDaysIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  SunIcon,
  XMarkIcon,
  CodeBracketIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//
import { format, formatDistanceToNow } from "date-fns";

//-- Utility Functions --//
import classNames from "../Util/classNames";

//-- Data Objects, Environment Variables --//
import { echartsThemeState } from "./atoms";
import { IConversationSerialized } from "../App/GPT/chatson/chatson_types";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {
  infoMode: boolean;
}
export default function AppLayout({ infoMode }: IProps) {
  //== React State ==//
  const ConversationsContext = useConversationsContext();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentNavItem, setCurrentNavItem] = useState<string>(
    window.location.pathname
  );

  //-- Auth0 --//
  const { logout, user } = useAuth0();

  //--- Navigation array depend on infoMode --//
  interface INavigationItem {
    name: string;
    to: string;
    icon: React.ComponentType<any>;
  }
  let navigationItems: INavigationItem[];
  {
    infoMode
      ? (navigationItems = [
          // { name: "Info", to: "/info", icon: InformationCircleIcon },
          { name: "Product Updates", to: "/updates", icon: CodeBracketIcon },
          { name: "FAQ", to: "/faq", icon: QuestionMarkCircleIcon },
          { name: "Terms of Service", to: "/terms", icon: DocumentTextIcon },
          {
            name: "Privacy Statement",
            to: "/privacy",
            icon: DocumentTextIcon,
          },
          { name: "Cookies Policy", to: "/cookies", icon: DocumentTextIcon },
          {
            name: "System Requirements",
            to: "/system_requirements",
            icon: ComputerDesktopIcon,
          },
          {
            name: "OAuth 2 - Google Accounts",
            to: "/oauth2_google",
            icon: LockClosedIcon,
          },
        ])
      : (navigationItems = [
          { name: "Home", to: "/", icon: HomeIcon },
          { name: "Journal", to: "/journal", icon: CalendarDaysIcon },
          { name: "Journal Files", to: "/files", icon: FolderIcon },
          { name: "ChrtGPT", to: "/gpt", icon: ChatBubbleLeftRightIcon },
          // { name: "Market Data", to: "/data", icon: PresentationChartLineIcon },
        ]);
  }
  //-- userNavigationItems array depend on infoMode --//
  interface IUserNavigationItem {
    name: string;
    to: string;
  }
  let userNavigationItems: IUserNavigationItem[] = [
    { name: "Profile", to: "/profile" },
    { name: "Settings", to: "/settings" },
  ];

  //-- Theming - Light Mode, Dark Mode, Match OS Mode --//
  let theme: string | null = localStorage.getItem("theme");
  const [themeButtonSelection, setThemeButtonSelection] = useState<
    string | null
  >(theme); //-- light || dark || null (OS match) --//
  const [echartsTheme, setEchartsTheme] = useRecoilState(echartsThemeState);

  //-- NOTES ABOUT THEMES: --//
  //-- OS theme changes are listened for in index.html --//
  //-- Manual theme overrides are listened for here --//
  //-- In both cases, the documentElement's classList is modified --//
  //-- The localStorage 'theme' value nullifies any OS theme change events --//
  //-- (the event listener in index.html only works if there's no 'theme' value) --//

  //-- The ECharts Theme is set here to follow the application theme --//
  //-- When no localStorage 'theme' value is set, OS theme is listened to --//
  //-- When localStorage 'theme' value is set, that's used --//

  const useManualDarkMode = () => {
    //-- Set theme to dark in localStorage --//
    localStorage.setItem("theme", "dark");
    //-- Update theme to dark mode --//
    document.documentElement.classList.add("dark");
    setEchartsTheme("dark");
    //-- Update themeButtonSelection --//
    setThemeButtonSelection("dark");
  };

  const useOSTheme = () => {
    //-- Remove theme from localStorage --//
    localStorage.removeItem("theme");
    //-- Update theme to match current OS theme --//
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setEchartsTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setEchartsTheme("light");
    }
    //-- Update themeButtonSelection --//
    setThemeButtonSelection(null);
  };

  const useManualLightMode = () => {
    //-- Set theme to light in localStorage --//
    localStorage.setItem("theme", "light");
    //-- Update theme to light mode --//
    document.documentElement.classList.remove("dark");
    setEchartsTheme("light");
    //-- Update themeButtonSelection --//
    setThemeButtonSelection("light");
  };

  useEffect(() => {
    const handleThemeChange = ({ matches }: MediaQueryListEvent) => {
      //-- Only react to OS theme changes if no 'theme' value is set in localStorage --//
      if (!("theme" in localStorage)) {
        if (matches) {
          setEchartsTheme("dark");
        } else {
          setEchartsTheme("light");
        }
      }
    };

    //-- Listen for OS theme changes --//
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleThemeChange);

    return window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", handleThemeChange);
  }, []);

  //-- ************************* --//
  //== Secondary List components ==//
  const { pathname } = useLocation();

  //-- Conversations List --//
  const { getAccessTokenSilently } = useAuth0();
  const getConversationsListHandler = async () => {
    console.log("AppLayout -- getConversationsList"); // DEV
    let accessToken = await getAccessTokenSilently();
    let list = await getConversationsList(accessToken);
    ConversationsContext.setConversationsArray(list);
  };
  const ConversationRow = (props: { row: IConversationSerialized }) => {
    const { row } = props;
    const formattedDate: string = row.created_at
      ? format(new Date(row.created_at), "MMM dd, yyyy")
      : "-";
    const formattedTime: string = row.created_at
      ? format(new Date(row.created_at), "hh:mm aaa")
      : "";
    const timeDistanceToNow = row.created_at
      ? formatDistanceToNow(new Date(row.created_at)) + " ago"
      : "-";
    return (
      <>
        <div className={classNames("rounded-md hover:bg-zinc-100")}>
          <p className="dark:text-zinc-200">
            {row.title + "this is the title string for the conversation..."}
          </p>
          <div className="flex flex-row justify-between">
            <p className="text-sm font-semibold text-zinc-500">
              {row.api_req_res_metadata.length === 1
                ? `${row.api_req_res_metadata.length} request`
                : `${row.api_req_res_metadata.length} requests`}
            </p>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-500">
              {formattedTime}
            </p>
          </div>
        </div>
      </>
    );
  };
  const ConversationsList = () => {
    if (
      ConversationsContext.conversationsArray &&
      ConversationsContext.conversationsArray.length > 0
    ) {
      return (
        <>
          <div className="flex flex-row">
            {/* Get Conversations List Button */}
            <button onClick={getConversationsListHandler}>
              refresh conversations list{" "}
            </button>
            {/* New conversation button */}
            <button
              onClick={() => {
                console.log("NEW CONVO");
              }}
            >
              new conversation
            </button>
          </div>

          {/* Virtuoso */}
          <Virtuoso
            id="virtuoso-conversations-list"
            data={ConversationsContext.conversationsArray}
            itemContent={(index, row) => {
              return <ConversationRow row={row} />;
            }}
          />
        </>
      );
    }
    return null;
  };

  return (
    <div
      id="app-layout-top-level-div"
      //-- With use of 'overflow-hidden', scroll behavior is to be handles by Outlet components (?) --//
      className="fixed h-full w-full overflow-hidden overscroll-none bg-zinc-50 dark:bg-zinc-800"
    >
      {/* START OF MOBILE SIDEBAR */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          id="app-layout-mobile-sidebar"
          as="div"
          className="relative z-40 lg:hidden"
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
            <div className="fixed inset-0 bg-zinc-600 bg-opacity-75 dark:bg-zinc-600" />
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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-zinc-50 pb-4 pt-5 dark:bg-zinc-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-0 -mr-12 pt-2">
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
                    className="h-8 w-auto px-2 font-sans text-3xl font-semibold text-black hover:text-green-500 dark:text-white dark:hover:text-green-500"
                  >
                    chrt
                  </a>
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {navigationItems.map((item) => (
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
      <div
        id="app-layout-static-sidebar"
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-48 lg:flex-col"
      >
        <div
          id="sidebar-primary-items-list"
          className="flex h-full flex-col overflow-y-auto bg-zinc-50 pt-3 dark:bg-zinc-800"
        >
          {/* START OF CHRT LOGO */}
          <div className="flex flex-shrink-0 items-center px-6">
            <a
              href={window.location.origin}
              className="h-8 w-auto pl-2 font-sans text-3xl font-semibold text-zinc-900 hover:text-green-500 dark:text-white dark:hover:text-green-500"
            >
              chrt
            </a>
          </div>
          {/* END OF CHRT LOGO */}
          {/* START OF NAVIGATION ITEMS */}
          <div className="mt-4 flex flex-col">
            <nav className="flex-1 space-y-1 pb-3 pl-3">
              {navigationItems.map((item) => (
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
                    "group flex items-center rounded-md px-2 py-1.5 text-sm font-medium"
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
          {/* END OF NAVIGATION ITEMS */}

          <div
            //-- DIVIDER --//
            className={classNames(
              "ml-3 w-full pb-2",
              pathname == "/gpt" //-- Add any route that needs the divider --//
                ? "border-t border-zinc-300 dark:border-zinc-500"
                : ""
            )}
            aria-hidden="true"
          />

          {/* START OF SECONDARY ITEMS */}
          <div
            id="secondary-items-list"
            className="ml-3 flex-grow overflow-y-auto"
          >
            {pathname === "/gpt" && <ConversationsList />}
          </div>
          {/* END OF SECONDARY ITEMS */}
        </div>
      </div>
      {/* END OF STATIC SIDEBAR */}

      {/* START OF RHS */}
      <div
        id="app-layout-rhs-div"
        className="h-full overflow-y-auto overflow-x-hidden lg:pl-48"
      >
        <div
          id="app-layout-rhs-content"
          className="mx-auto flex h-full max-w-screen-2xl flex-col px-4 xl:px-6"
        >
          {/* START OF HAMBURGER BUTTON + SEARCH BAR + PROFILE PICTURE + DROPDOWN MENU */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-zinc-50 dark:bg-zinc-800">
            {/* START OF HAMBURGER BUTTON */}
            <button
              type="button"
              className="pr-4 text-zinc-500 hover:text-green-600 hover:outline-none hover:ring-2 hover:ring-inset hover:ring-transparent lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* END OF HAMBURGER BUTTON */}

            {/* START OF SEARCH BAR + PROFILE PICTURE + DROPDOWN MENU */}
            <div className="flex flex-1 justify-between">
              {/* START OF SEARCH BAR */}
              <div className="flex flex-1">
                <form className="flex w-full lg:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-zinc-600 focus-within:text-zinc-800 dark:text-zinc-400  dark:focus-within:text-white">
                    {/* <div className="pointer-events-none absolute inset-y-0 left-0 ml-2 flex items-center lg:ml-0">
                      <MagnifyingGlassIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div> */}
                    {/* <input
                      id="search-field"
                      disabled={showLockIcon}
                      className="block h-full w-full border-transparent border-b-zinc-300 bg-zinc-50 py-2 pl-10 pr-3 text-zinc-900 placeholder-zinc-500 focus:border-transparent focus:border-b-zinc-400 focus:placeholder-zinc-400 focus:outline-none focus:ring-0 dark:border-b-zinc-500 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 dark:focus:border-b-zinc-400 dark:focus:placeholder-zinc-500 lg:pl-8"
                      placeholder="Search"
                      type="search"
                      name="search"
                    /> */}
                  </div>
                </form>
              </div>
              {/*END OF SEARCH BAR  */}

              {/* START OF DROPDOWN MENU + PROFILE PICTURE*/}
              <div className="ml-4 flex items-center lg:ml-6">
                {/* START OF DROPDOWN MENU */}
                <Menu
                  id="app-layout-dropdown-menu"
                  as="div"
                  className="relative ml-3"
                >
                  <div>
                    {/* START OF PROFILE PICTURE */}

                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm hover:outline-none hover:ring-2 hover:ring-green-500 hover:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      {user?.picture ? (
                        <img
                          className="h-8 w-8 rounded-full focus:bg-white active:bg-white"
                          src={user.picture}
                          alt="profile image"
                          referrerPolicy="no-referrer" //-- Prevents intermittent 403 error, https://community.auth0.com/t/google-account-picture-request-forbidden/42031/11 --//
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
                    <Menu.Items className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-900 dark:ring-zinc-500">
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
                                  themeButtonSelection === "light"
                                    ? "bg-zinc-400 text-white"
                                    : "bg-white text-zinc-700",
                                  "relative inline-flex items-center rounded-l-md border border-zinc-400 px-4 py-2 text-sm font-medium hover:bg-zinc-300 focus:z-10 focus:outline-none dark:border-zinc-700 "
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
                                  !themeButtonSelection
                                    ? "bg-zinc-400 text-white"
                                    : "bg-white text-zinc-700",
                                  "relative -ml-px inline-flex items-center border border-zinc-400 px-4 py-2 text-sm font-medium hover:bg-zinc-300 focus:z-10 focus:outline-none  dark:border-zinc-700 "
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
                                  themeButtonSelection === "dark"
                                    ? "bg-zinc-700 text-white"
                                    : "bg-white text-zinc-700",
                                  "relative -ml-px inline-flex items-center rounded-r-md border border-zinc-400 px-4 py-2 text-sm font-medium hover:bg-zinc-300 focus:z-10 focus:outline-none  dark:border-zinc-700 "
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

                      {/* !infomode to use NavLink (react router links) */}
                      {!infoMode &&
                        userNavigationItems.map((item) => (
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

                      {/* infomode to use a + href (to cause browser to reload) */}
                      {infoMode &&
                        userNavigationItems.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={`${window.location.origin}${item.to}`}
                                className={classNames(
                                  active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                                  "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}

                      {/* Terms, Privacy, & More */}
                      <Menu.Item key={"terms-privacy-faq"}>
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
                              localStorage.removeItem("theme");
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
                            {user ? <p>Sign Out</p> : <p>Homepage</p>}
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
          <main id="app-layout-react-router-Outlet" className="h-full">
            <Outlet />
          </main>
          {/* END OF MAIN */}
        </div>
      </div>
      {/* END OF RHS */}
    </div>
  );
}
