//== react, react-router-dom, recoil, Auth0 ==//
import { Fragment, useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components, Functions ==//

//== NPM Components ==//
import { Menu, Transition } from "@headlessui/react";

//== Icons ==//
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import {
  EllipsisHorizontalCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import classNames from "../Util/classNames";

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function MainMenu() {
  //== React State, Custom Hooks ==//
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
            "inline-flex w-full flex-row items-center justify-start rounded-md px-2 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 focus:outline-none",
            "focus:ring-inset focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:bg-zinc-800"
          )}
        >
          {user?.picture ? (
            <>
              <div className="flex w-full flex-row items-center justify-start overflow-clip">
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
                    {/* von VeryLongLastName SoLongItWontFitInThisComponentWithoutBreaking */}
                    {/* TODO - test with longer names */}
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
              <div className="flex w-full flex-row items-center justify-start overflow-clip">
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
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active
                      ? "bg-zinc-500 text-white"
                      : "text-zinc-900 dark:text-zinc-200"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active
                      ? "bg-zinc-500 text-white"
                      : "text-zinc-900 dark:text-zinc-200"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                  Duplicate
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active
                      ? "bg-zinc-500 text-white"
                      : "text-zinc-900 dark:text-zinc-200"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                  Archive
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active
                      ? "bg-zinc-500 text-white"
                      : "text-zinc-900 dark:text-zinc-200"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ) : (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )}
                  Move
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active
                      ? "bg-zinc-500 text-white"
                      : "text-zinc-900 dark:text-zinc-200"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5 text-zinc-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <Cog8ToothIcon
                      className="mr-2 h-5 w-5 text-zinc-400"
                      aria-hidden="true"
                    />
                  )}
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
