//== react, react-router-dom, Auth0 ==//
import { Fragment, SetStateAction, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../../Context/AccountContext";
import { axiosErrorToaster } from "../../../../Errors/axiosErrorToaster";
import removeRole from "../Util/removeRole";

//== NPM Components ==//
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

//== Icons ==//
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//
import { getUsersPermissions } from "../Util/getUserPermissions";
import { isRoleActive } from "../Util/isRoleActive";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { MinusCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import classNames from "../../../../Util/classNames";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

const ROLE_NAME = "Free Preview Access";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function RemoveFreePreviewModal({
  modalOpen,
  setModalOpen,
}: IProps) {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();
  const { getAccessTokenSilently, user } = useAuth0();
  const cancelButtonRef = useRef(null);

  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//
  const removeFreePreviewhandler = async () => {
    AccountContext.setChangingFreePreview(true);

    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      await removeRole(accessToken, ROLE_NAME);

      //-- Force non-cache refresh of access token --//
      accessToken = await getAccessTokenSilently({ cacheMode: "off" }); //-- Security --//

      //-- Update listed permissions --//
      try {
        await getUsersPermissions(accessToken, AccountContext);
      } catch (err) {
        if (err instanceof AxiosError) {
          axiosErrorToaster(err, "Get subscriptions");
        } else if (err instanceof Error) {
          toast(err.message);
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Remove subscription");
      } else if (err instanceof Error) {
        toast(err.message);
      }
    }

    AccountContext.setChangingFreePreview(false);
    setModalOpen(false);
  };

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
                          As this preview is free, you can sign up again if you
                          want.
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

                  {/* START OF CONFIRM BUTTON */}
                  <button
                    type="button"
                    disabled={!isRoleActive(ROLE_NAME, AccountContext)}
                    onClick={removeFreePreviewhandler}
                    className={classNames(
                      "tex-stm w-full items-center gap-x-2 rounded-md px-3.5 py-2.5 text-center font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:w-64",
                      !AccountContext.rolesFetched
                        ? "animate-pulse bg-zinc-200 text-zinc-500"
                        : AccountContext.changingFreePreview
                        ? "animate-pulse cursor-not-allowed bg-zinc-200 text-zinc-900"
                        : !isRoleActive(ROLE_NAME, AccountContext)
                        ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                        : isRoleActive(ROLE_NAME, AccountContext)
                        ? "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600"
                        : ""
                    )}
                  >
                    {!AccountContext.rolesFetched ? (
                      <div className="flex flex-row items-center justify-center">
                        <p className="mr-2 text-sm">Loading...</p>
                      </div>
                    ) : AccountContext.changingFreePreview ? (
                      <div className="flex flex-row items-center justify-center">
                        <p className="mr-2 text-sm">Updating...</p>
                      </div>
                    ) : !isRoleActive(ROLE_NAME, AccountContext) ? (
                      <div className="flex flex-row items-center justify-center">
                        <p className="mr-2 text-sm">{ROLE_NAME} inactive</p>
                        <XCircleIcon className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex flex-row items-center justify-center">
                        <MinusCircleIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                        <p className="ml-2 text-sm">Remove {ROLE_NAME}</p>
                      </div>
                    )}
                  </button>
                  {/* END OF CONFIRM BUTTON */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
