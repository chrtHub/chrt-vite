//== react, react-router-dom, Auth0 ==//
import { Fragment, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAccountContext } from "../Context/AccountContext";

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
  ShieldCheckIcon,
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
  setSignOutModalOpen: React.Dispatch<SetStateAction<boolean>>;
  setMobileSidebarOpen?: React.Dispatch<SetStateAction<boolean>>;
}
export default function MainMenu({
  setSignOutModalOpen,
  setMobileSidebarOpen,
}: IProps) {
  //== React State, Custom Hooks ==//
  const SiteContext = useSiteContext();
  const AccountContext = useAccountContext();

  //== Auth ==//
  const { user } = useAuth0();

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <Menu
      as="div"
      className="relative mb-0 w-full pl-3 pr-3 text-left lg:mb-2 lg:pr-0"
    >
      {({ open }) => (
        <>
          <div>
            <Menu.Button
              id="main-menu-button"
              className={classNames(
                "inline-flex w-full flex-row items-center justify-start rounded-md px-2 py-1.5 text-sm font-medium focus:outline-none",
                "ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700",
                open
                  ? "bg-zinc-300 dark:bg-zinc-700"
                  : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              )}
            >
              {user?.picture ? (
                <>
                  <div className="flex w-full flex-row items-center justify-start overflow-x-scroll">
                    {/* Main Menu Button */}
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
                  {/* START OF NOTIFICATIONS BADGE OR ELLIPSIS */}
                  {/* TODO - notifications badge with count */}
                  {false ? (
                    <span className="ml-auto flex items-center gap-x-1.5 rounded-full bg-emerald-200 px-2 py-1 text-xs font-medium text-emerald-800">
                      <svg
                        className="h-1.5 w-1.5 fill-emerald-500"
                        viewBox="0 0 6 6"
                        aria-hidden="true"
                      >
                        <circle cx={3} cy={3} r={3} />
                      </svg>
                      {/* Notification Count */}
                      <p>{!AccountContext.clickwrapIsActive && 1}</p>
                    </span>
                  ) : (
                    <EllipsisHorizontalCircleIcon
                      className="ml-auto h-7 w-7 text-zinc-500 dark:text-zinc-500"
                      aria-hidden="true"
                    />
                  )}

                  {/* END OF NOTIFICATIONS BADGE OR ELLIPSIS */}
                </>
              ) : (
                <>
                  <div className="flex w-full flex-row items-center justify-start overflow-x-scroll">
                    {/* Main Menu Button */}
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
                        ? "bg-amber-300 text-zinc-600"
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

              {/* START OF ACCOUNT, SETTINGS, SUBSCRIPTIONS, DATA PRIVACY */}
              <div>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to={"/account"}
                      onClick={() => {
                        if (setMobileSidebarOpen) {
                          setMobileSidebarOpen(false);
                        }
                      }}
                      className={classNames(
                        "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                        "text-zinc-700 dark:text-white",
                        active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                      )}
                    >
                      {/* START OF ICON AND MENU ITEM NAME */}
                      <UserIcon className="h-6 w-6" />
                      Account
                      {/* END OF ICON AND MENU ITEM NAME */}
                      {/* START OF NOTIFICATION BADGE */}
                      {/* TODO */}
                      {/* END OF NOTIFICATION BADGE */}
                    </NavLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to={"/account/settings"}
                      onClick={() => {
                        if (setMobileSidebarOpen) {
                          setMobileSidebarOpen(false);
                        }
                      }}
                      className={classNames(
                        "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                        "text-zinc-700 dark:text-white",
                        active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                      )}
                    >
                      {/* START OF ICON AND MENU ITEM NAME */}
                      <Cog8ToothIcon className="h-6 w-6" />
                      Settings
                      {/* END OF ICON AND MENU ITEM NAME */}
                      {/* START OF NOTIFICATION BADGE */}
                      {/* TODO */}
                      {/* END OF NOTIFICATION BADGE */}
                    </NavLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to={"/account/subscriptions"}
                      onClick={() => {
                        if (setMobileSidebarOpen) {
                          setMobileSidebarOpen(false);
                        }
                      }}
                      className={classNames(
                        "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                        "text-zinc-700 dark:text-white",
                        active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                      )}
                    >
                      {/* START OF ICON AND MENU ITEM NAME */}
                      <KeyIcon className="h-6 w-6" />
                      Subscriptions
                      {/* END OF ICON AND MENU ITEM NAME */}
                      {/* START OF NOTIFICATION BADGE */}
                      {/* TODO */}
                      {/* END OF NOTIFICATION BADGE */}
                    </NavLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to={"/account/data_privacy"}
                      onClick={() => {
                        if (setMobileSidebarOpen) {
                          setMobileSidebarOpen(false);
                        }
                      }}
                      className={classNames(
                        "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                        "text-zinc-700 dark:text-white",
                        active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                      )}
                    >
                      {/* START OF ICON AND MENU ITEM NAME */}
                      <ShieldCheckIcon className="h-6 w-6" />
                      <p>Data Privacy</p>
                      {/* END OF ICON AND MENU ITEM NAME */}

                      {/* START OF NOTIFICATION BADGE */}
                      {/* TODO */}
                      {/* END OF NOTIFICATION BADGE */}
                    </NavLink>
                  )}
                </Menu.Item>
              </div>
              {/* END OF ACCOUNT, SETTINGS, SUBSCRIPTIONS, DATA PRIVACY */}

              <div>
                {/* START OF SUPPORT */}
                <Menu.Item key={"support"}>
                  {({ active }) => (
                    <NavLink
                      to={"/support"}
                      onClick={() => {
                        if (setMobileSidebarOpen) {
                          setMobileSidebarOpen(false);
                        }
                      }}
                      className={classNames(
                        "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                        "text-zinc-700 dark:text-white",
                        active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                      )}
                    >
                      {/* START OF ICON AND MENU ITEM NAME */}
                      <ComputerDesktopIcon className="h-6 w-6" />
                      Support
                      {/* END OF ICON AND MENU ITEM NAME */}
                      {/* START OF NOTIFICATION BADGE */}
                      {/* TODO */}
                      {/* END OF NOTIFICATION BADGE */}
                    </NavLink>
                  )}
                </Menu.Item>
                {/* END OF SUPPORT */}

                {/* START OF TERMS */}
                <Menu.Item key={"terms-privacy-faq"}>
                  {({ active }) => (
                    <NavLink
                      to={"/terms"}
                      onClick={() => {
                        if (setMobileSidebarOpen) {
                          setMobileSidebarOpen(false);
                        }
                      }}
                      className={classNames(
                        "flex flex-row items-center justify-start gap-3 px-4 py-2 text-sm",
                        "text-zinc-700 dark:text-white",
                        active ? "bg-zinc-200 dark:bg-zinc-700" : ""
                      )}
                    >
                      {/* START OF ICON AND MENU ITEM NAME */}
                      <DocumentTextIcon className="h-6 w-6" />
                      Terms, Privacy, etc.
                      {/* END OF ICON AND MENU ITEM NAME */}
                      {/* START OF NOTIFICATION BADGE */}
                      {/* TODO */}
                      {/* END OF NOTIFICATION BADGE */}
                    </NavLink>
                  )}
                </Menu.Item>
              </div>
              {/* END OF TERMS */}

              {/* START OF SIGN OUT */}
              <div>
                {/* Sign Out Button  */}
                <Menu.Item key={"sign-out-button"}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        //-- Open "Confirm Sign Out" Modal --//
                        setSignOutModalOpen(true);
                        if (setMobileSidebarOpen) {
                          setMobileSidebarOpen(false);
                        }
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
        </>
      )}
    </Menu>
  );
}
