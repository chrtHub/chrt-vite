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
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  EllipsisHorizontalCircleIcon,
  KeyIcon,
  UserCircleIcon,
  UserIcon,
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
            "divide-zinc-300 bg-zinc-100 ring-zinc-200",
            "dark:divide-zinc-600 dark:bg-zinc-800 dark:ring-zinc-700"
          )}
        >
          {/* START OF THEME */}
          <div className="flex w-full flex-row pb-0.5 pt-1">
            <Tooltip placement="top" content="Light Mode">
              <button
                onClick={SiteContext.setManualLightMode}
                className={classNames(
                  "mx-3 flex w-1/3 flex-row items-center justify-center rounded-full py-2",
                  SiteContext.themeButtonSelection === "light"
                    ? "bg-yellow-300 text-zinc-600"
                    : "text-zinc-700 hover:bg-zinc-500 hover:text-zinc-100 dark:text-zinc-100"
                )}
              >
                <SunIcon className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip placement="top" content="System Mode">
              <button
                onClick={SiteContext.setOSTheme}
                className={classNames(
                  "mx-3 flex w-1/3 flex-row items-center justify-center rounded-full py-2",
                  !SiteContext.themeButtonSelection
                    ? "bg-green-600 text-white dark:bg-green-800"
                    : "text-zinc-700 hover:bg-zinc-500 hover:text-zinc-100 dark:text-zinc-100"
                )}
              >
                <ComputerDesktopIcon className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip placement="top" content="Dark Mode">
              <button
                onClick={SiteContext.setManualDarkMode}
                className={classNames(
                  "mx-3 flex w-1/3 flex-row items-center justify-center rounded-full py-2",
                  SiteContext.themeButtonSelection === "dark"
                    ? "bg-zinc-900 text-zinc-100"
                    : "text-zinc-700 hover:bg-zinc-500 hover:text-zinc-100 dark:text-zinc-100"
                )}
              >
                <MoonIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
          {/* END OF THEME */}

          <div>
            {/* START OF SUPPORT */}
            <Menu.Item key={"terms-privacy-faq"}>
              {({ active }) => (
                <NavLink
                  to={"/support"}
                  className={classNames(
                    "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                    "text-zinc-700 dark:text-white",
                    active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                  )}
                >
                  <ComputerDesktopIcon className="h-6 w-6" />
                  Support
                </NavLink>
              )}
            </Menu.Item>
            {/* END OF SUPPORT */}

            {/* START OF TERMS */}
            <Menu.Item key={"terms-privacy-faq"}>
              {({ active }) => (
                <NavLink
                  to={"/terms"}
                  className={classNames(
                    "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                    "text-zinc-700 dark:text-white",
                    active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                  )}
                >
                  <DocumentTextIcon className="h-6 w-6" />
                  Terms, Privacy, etc.
                </NavLink>
              )}
            </Menu.Item>
          </div>
          {/* END OF TERMS */}

          {/* START OF ACCOUNT, SUBSCRIPTIONS, SETTINGS */}
          <div>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to={"/account"}
                  className={classNames(
                    "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                    "text-zinc-700 dark:text-white",
                    active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                  )}
                >
                  <UserIcon className="h-6 w-6" />
                  Account
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to={"/account/subscriptions"}
                  className={classNames(
                    "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                    "text-zinc-700 dark:text-white",
                    active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                  )}
                >
                  <KeyIcon className="h-6 w-6" />
                  Subscriptions
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to={"/settings"}
                  className={classNames(
                    "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                    "text-zinc-700 dark:text-white",
                    active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                  )}
                >
                  <Cog8ToothIcon className="h-6 w-6" />
                  Settings
                </NavLink>
              )}
            </Menu.Item>
          </div>
          {/* END OF ACCOUNT, SUBSCRIPTIONS, SETTINGS */}

          {/* START OF SIGN OUT */}
          <div>
            {/* Sign Out Button  */}
            <Menu.Item key={"sign-out-button"}>
              {({ active }) => (
                <button
                  onClick={() => {
                    //-- Open "Confirm Sign Out" Modal --//
                    setSignOutModalOpen(true);
                  }}
                  className={classNames(
                    "flex w-full flex-row items-center justify-start gap-3 rounded-b-md px-4 py-2 text-sm",
                    "text-zinc-700 dark:text-white",
                    active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                  )}
                >
                  <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                  <p>Sign Out</p>
                </button>
              )}
            </Menu.Item>
          </div>
          {/* END OF SIGN OUT */}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
