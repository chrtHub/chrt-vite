//-- react, react-router-dom, recoil, Auth0 --//
import { Fragment, useState, useEffect, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState } from "recoil";

//-- TSX Components --//
import Tooltip from "../Components/Tooltip";

//-- NPM Components --//
import { useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { usePopper } from "react-popper";

//-- Icons --//
import { UserCircleIcon, MoonIcon } from "@heroicons/react/20/solid";
import { ComputerDesktopIcon, SunIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../Util/classNames";

//-- Data Objects, Environment Variables --//
import { echartsThemeState } from "./atoms";

interface IProps {
  signOutModalOpen: boolean;
  setSignOutModalOpen: React.Dispatch<SetStateAction<boolean>>;
  infoMode: boolean;
}
export default function DropdownMenu({
  signOutModalOpen,
  setSignOutModalOpen,
  infoMode,
}: IProps) {
  //-- Auth0 --//
  const { user } = useAuth0();

  //-- userNavigationItems array depend on infoMode --//
  interface IUserNavigationItem {
    name: string;
    to: string;
  }
  let userNavigationItems: IUserNavigationItem[] = [
    { name: "Account & Subscriptions", to: "/account" },
    { name: "Settings", to: "/settings" },
  ];

  //-- Tooltips (via react-popper) --//
  //   const [lightModeTooltipVisible, setLightModeTooltipVisible] =
  //     useState<boolean>(false);
  //   const [lightModeButton, setLightModeButton] = useState<HTMLElement | null>(
  //     null
  //   );
  //   const [lightModeTooltip, setLightModeTooltip] = useState<HTMLElement | null>(
  //     null
  //   );
  //   const { styles, attributes } = usePopper(lightModeButton, lightModeTooltip, {
  //     placement: "top",
  //   });

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
  //-- END OF THEMES --//

  //-- ***** COMPONENT RETURN ***** --//
  return (
    <Menu id="app-layout-dropdown-menu" as="div" className="relative ml-3">
      {/* START OF PROFILE PICTURE */}
      <div>
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
      </div>
      {/* END OF PROFILE PICTURE */}

      {/* START OF MENU ITEMS */}
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
                  {/* Light Mode Button */}
                  <Tooltip placement="top" content="Light Mode">
                    <button
                      type="button"
                      onClick={useManualLightMode}
                      className={classNames(
                        themeButtonSelection === "light"
                          ? "bg-zinc-700 text-white"
                          : "bg-white text-zinc-700 hover:bg-zinc-300",
                        "relative inline-flex items-center rounded-l-md border border-zinc-700 px-4 py-2 text-sm font-medium focus:z-10 focus:outline-none dark:border-zinc-700 "
                      )}
                    >
                      <span className="sr-only">Light Mode</span>
                      <SunIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </Tooltip>

                  {/* Match System Mode Button + Tooltip */}
                  <Tooltip placement="top" content="System Mode">
                    <button
                      type="button"
                      onClick={useOSTheme}
                      className={classNames(
                        !themeButtonSelection
                          ? "bg-zinc-700 text-white"
                          : "bg-white text-zinc-700 hover:bg-zinc-300",
                        "relative -ml-px inline-flex items-center border border-zinc-700 px-4 py-2 text-sm font-medium focus:z-10 focus:outline-none  dark:border-zinc-700 "
                      )}
                    >
                      <span className="sr-only">Match OS Mode</span>
                      <ComputerDesktopIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </Tooltip>

                  {/* Dark Mode Button + Tooltip */}
                  <Tooltip placement="top" content="Dark Mode">
                    <button
                      type="button"
                      onClick={useManualDarkMode}
                      data-tooltip="Dark Mode"
                      className={classNames(
                        themeButtonSelection === "dark"
                          ? "bg-zinc-700 text-white"
                          : "bg-white text-zinc-700 hover:bg-zinc-300",
                        "relative -ml-px inline-flex items-center rounded-r-md border border-zinc-700 px-4 py-2 text-sm font-medium focus:z-10 focus:outline-none dark:border-zinc-700 "
                      )}
                    >
                      <span className="sr-only">Dark Mode</span>
                      <MoonIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </Tooltip>
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
                    // onClick={() => setCurrentNavItem(item.to)}
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
                  //-- Open "Confirm Sign Out" Modal --//
                  setSignOutModalOpen(true);
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
      {/* END OF MENU ITEMS */}
    </Menu>
  );
}
