import { Fragment, useState, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth0 } from "@auth0/auth0-react";
import classNames from "../Util/classNames";

interface IProps {
  signOutModalOpen: boolean;
  setSignOutModalOpen: React.Dispatch<SetStateAction<boolean>>;
}
export default function ConfirmSignOutModal({
  signOutModalOpen,
  setSignOutModalOpen,
}: IProps) {
  const { logout, user } = useAuth0();

  return (
    <Transition.Root show={signOutModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setSignOutModalOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity dark:bg-zinc-900 dark:bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-50 px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-zinc-950 sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setSignOutModalOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600 dark:text-red-300"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
                    >
                      Confirm Sign Out
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Or continue your session
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-row justify-end">
                  <button
                    type="button"
                    className={classNames(
                      "mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset",
                      "bg-zinc-50 text-zinc-900 ring-zinc-300 hover:bg-zinc-200",
                      "dark:bg-zinc-700 dark:text-zinc-300 dark:ring-zinc-400 dark:hover:bg-zinc-500",
                      "sm:mt-0 sm:w-auto"
                    )}
                    onClick={() => setSignOutModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm",
                      "bg-red-600 text-white hover:bg-red-500",
                      "dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-600",
                      "sm:ml-3 sm:w-auto"
                    )}
                    onClick={() => {
                      //-- Remove localStorage items --//
                      // localStorage.clear()
                      localStorage.removeItem("theme");
                      localStorage.removeItem("sortBy");
                      //-- Logout --//
                      logout({
                        logoutParams: {
                          returnTo: window.location.origin,
                        },
                      });
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
