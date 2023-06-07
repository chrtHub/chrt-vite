//== react, react-router-dom, Auth0 ==//
import { Fragment, useEffect, useRef, useState, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { useSiteContext } from "../Context/SiteContext";

//== TSX Components, Functions ==//
import Tooltip from "../Components/Tooltip";

//== NPM Components ==//
import { Menu, Transition } from "@headlessui/react";

//== Icons ==//
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import {
  EllipsisHorizontalCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import classNames from "../Util/classNames";

import { MoonIcon } from "@heroicons/react/20/solid";
import { ComputerDesktopIcon, SunIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  signOutModalOpen: boolean;
  setSignOutModalOpen: React.Dispatch<SetStateAction<boolean>>;
  infoMode: boolean;
}
export default function MainMenu({
  signOutModalOpen,
  setSignOutModalOpen,
  infoMode,
}: IProps) {
  //== React State, Custom Hooks ==//
  let SiteContext = useSiteContext();
  const { user } = useAuth0();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <Menu as="div" className="relative mb-2 w-full pl-3 text-left">
      <div>
        <Menu.Button
          className={classNames(
            "inline-flex w-full flex-row items-center justify-start rounded-md px-2 py-1.5 text-sm font-medium focus:outline-none",
            "focus:ring-inset focus-visible:ring-2",
            "hover:bg-zinc-200 focus-visible:ring-zinc-400 ui-open:bg-zinc-200",
            "dark:hover:bg-zinc-800 dark:ui-open:bg-zinc-800"
          )}
        >
          {user?.picture ? (
            <>
              <div className="flex w-full flex-row items-center justify-start overflow-x-scroll">
                {/* Account button */}
                <div className="flex w-full flex-row items-center justify-start rounded-lg">
                  <img
                    className="h-10 w-10 rounded-md"
                    src={user?.picture}
                    referrerPolicy="no-referrer" //-- Prevents intermittent 403 error, https://community.auth0.com/t/google-account-picture-request-forbidden/42031/11 --//
                    alt={user?.name || "user photo"}
                  />
                  <p className="text-md ml-3 break-words font-medium text-zinc-800 dark:text-zinc-100">
                    {user?.name}
                  </p>
                </div>
              </div>
              <EllipsisHorizontalCircleIcon
                className="ml-auto h-7 w-7 text-zinc-600 dark:text-zinc-400"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              <div className="flex w-full flex-row items-center justify-start overflow-x-scroll">
                {/* Account button */}
                <div className="flex w-full flex-row items-center justify-start rounded-lg">
                  <UserCircleIcon className="inline-block h-10 w-10 rounded-md text-zinc-300 dark:text-zinc-700" />
                </div>
              </div>
              <EllipsisHorizontalCircleIcon
                className="ml-auto h-7 w-7 text-zinc-400 dark:text-zinc-600"
                aria-hidden="true"
              />
            </>
          )}
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
        <Menu.Items
          className={classNames(
            "absolute bottom-full left-3 mb-1.5 w-56 divide-y rounded-md shadow-lg",
            "ring-2 ring-inset focus:outline-none",
            "divide-zinc-400 bg-zinc-200 ring-zinc-400",
            "dark:divide-zinc-700 dark:bg-zinc-800 dark:ring-zinc-700"
          )}
        >
          {/* START OF THEME */}
          <div className="px-1 py-1 ">
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
                        onClick={SiteContext.setManualLightMode}
                        className={classNames(
                          SiteContext.themeButtonSelection === "light"
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
                        onClick={SiteContext.setOSTheme}
                        className={classNames(
                          !SiteContext.themeButtonSelection
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
                        onClick={SiteContext.setManualDarkMode}
                        data-tooltip="Dark Mode"
                        className={classNames(
                          SiteContext.themeButtonSelection === "dark"
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
          </div>
          {/* END OF THEME */}

          {/* START OF ACCOUNT, SUBSCRIPTIONS, SETTINGS */}
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to={"/account"}
                  className={classNames(
                    active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                    "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                  )}
                >
                  Account
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to={"/account/subscriptions"}
                  className={classNames(
                    active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                    "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                  )}
                >
                  Subscriptions
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to={"/settings"}
                  className={classNames(
                    active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                    "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                  )}
                >
                  Settings
                </NavLink>
              )}
            </Menu.Item>
          </div>
          {/* END OF ACCOUNT, SUBSCRIPTIONS, SETTINGS */}

          {/* START OF TERMS+PRIVACY+FAQ AND SIGN OUT */}
          <div className="px-1 py-1 ">
            <Menu.Item key={"terms-privacy-faq"}>
              {({ active }) => (
                <NavLink
                  to={"/terms"}
                  className={classNames(
                    active ? "bg-zinc-100 dark:bg-zinc-800" : "",
                    "block px-4 py-2 text-sm text-zinc-700 dark:text-white"
                  )}
                >
                  Terms, Privacy, FAQ, etc.
                </NavLink>
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
          </div>
          {/* END OF TERMS+PRIVACY+FAQ AND SIGN OUT */}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
