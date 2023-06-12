//== react, react-router-dom, Auth0 ==//
import { useState, useRef, useEffect, Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Dialog, Transition } from "@headlessui/react";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../../Context/AccountContext";
import { getUserClickwrapData } from "./Util/getUserClickwrapData";
import { axiosErrorToaster } from "../../../../Errors/axiosErrorToaster";

//== NPM Components ==//

//== Icons ==//
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

//== Utility Functions ==//
import classNames from "../../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;
import {
  CURRENT_TERMS_EFFECTIVE_DATE,
  CURRENT_PRIVACY_EFFECTIVE_DATE,
  CURRENT_COOKIES_EFFECTIVE_DATE,
  CURRENT_AGE_REQUIREMENT_STATEMENT,
} from "./Util/CURRENT_AGREEMENT_DATES";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function WithdrawConsentButton() {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();
  const cancelButtonRef = useRef(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  //== Auth ==//
  let { getAccessTokenSilently, user } = useAuth0();
  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//
  const withdrawConsentHandler = async () => {
    AccountContext.setClickwrapStatusChanging(true);
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      await axios.post(
        `${VITE_ALB_BASE_URL}/legal/withdraw_clickwrap`,
        //-- Body Content --//
        {
          TERMS_VERSION_EFFECTIVE_DATE: CURRENT_TERMS_EFFECTIVE_DATE,
          PRIVACY_VERSION_EFFECTIVE_DATE: CURRENT_PRIVACY_EFFECTIVE_DATE,
          COOKIES_VERSION_EFFECTIVE_DATE: CURRENT_COOKIES_EFFECTIVE_DATE,
          AGE_REQUIREMENT_STATEMENT: CURRENT_AGE_REQUIREMENT_STATEMENT,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //-- Force a fetch of the new auth token with added permissions from Auth0 because all subscriptions should have been frozen (server-side) when user withdrew clickwrap agreements --//
      await getAccessTokenSilently({ cacheMode: "off" }); //-- Security --//

      //-- Fetch and update user's clickwrap status --//
      await getUserClickwrapData(accessToken, AccountContext);

      AccountContext.setClickwrapStatusChanging(false);
      //----//
    } catch (err) {
      AccountContext.setClickwrapStatusChanging(false);
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Withdraw agreements");
      } else if (err instanceof Error) {
        toast(err.message);
      }
    }
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      {/* START OF MODAL */}
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
            <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity dark:bg-zinc-900 dark:bg-opacity-75" />
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-zinc-950 sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 dark:bg-zinc-950 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-800 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-rose-600 dark:text-rose-200"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-50"
                        >
                          Are you sure?
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-zinc-500 dark:text-zinc-100">
                            By cancelling your agreements, you will immediately
                            lose access to all subscriptions. We cannot provide
                            our services to you without these agreements in
                            place.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end bg-zinc-100 px-6 py-3 dark:bg-zinc-800 md:flex-row">
                    {/* Cancel Button */}
                    <button
                      type="button"
                      className="flex w-full flex-row justify-center rounded-md bg-white px-3 py-2 text-center align-middle text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-600 sm:mt-0 md:w-auto"
                      onClick={() => setModalOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>

                    {/* Confirm Button */}
                    <button
                      type="button"
                      className={classNames(
                        "flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm",
                        "bg-rose-600 text-white hover:bg-rose-500",
                        "dark:bg-rose-800 dark:text-rose-50 dark:hover:bg-rose-600",
                        "sm:ml-3 sm:w-auto"
                      )}
                      onClick={withdrawConsentHandler}
                    >
                      Confirm
                    </button>
                    {/*  */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* END OF MODAL */}

      {/* START OF BUTTON */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-x-1.5 rounded-md bg-rose-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
      >
        Withdraw Agreements
        <ShieldExclamationIcon
          className="h-5 w-5 text-rose-200"
          aria-hidden="true"
        />
      </button>
      {/* END OF BUTTON */}
    </>
  );
}
