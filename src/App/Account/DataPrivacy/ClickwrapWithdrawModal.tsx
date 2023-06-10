//== react, react-router-dom, Auth0 ==//
import { useState, useRef, useEffect, Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Dialog, Transition } from "@headlessui/react";

//== TSX Components, Functions ==//
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";
import ClickwrapWithdrawButton from "./ClickwrapWithdrawButton";

//== NPM Components ==//

//== Icons ==//
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

//== NPM Functions ==//
import axios, { AxiosError } from "axios";

//== Utility Functions ==//
import classNames from "../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ClickwrapWithdrawModal({
  modalOpen,
  setModalOpen,
}: IProps) {
  //== React State, Custom Hooks ==//
  const cancelButtonRef = useRef(null);

  // const AccountContext = useAccountContext();
  // const { showBoundary } = useErrorBoundary();

  //== Auth ==//
  let { getAccessTokenSilently, user } = useAuth0();

  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setModalOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Are you sure?
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          By cancelling your agreements, you will immediately
                          lose access to your subscription. We cannot provide
                          our services to you without these agreements in place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-end gap-2 bg-gray-50 px-6 py-3 md:flex-row md:px-4">
                  <button
                    type="button"
                    className="flex w-full flex-row justify-center rounded-md bg-white px-3 py-2 text-center align-middle text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 md:w-auto"
                    onClick={() => setModalOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>

                  {/* Remove Free Preview Access Button */}
                  <ClickwrapWithdrawButton setModalOpen={setModalOpen} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
