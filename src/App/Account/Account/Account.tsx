//-- react, react-router-dom, Auth0 --//
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components and Functions --//

//-- NPM Components --//

//-- Icons --//
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//
import { useCopyToClipboard } from "usehooks-ts";

//-- Utility Functions --//
import classNames from "../../../Util/classNames";

//-- Data Objects, Types --//
import ActiveSubscriptionsWithFallback from "./ActiveSubscriptionsWithFallback";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Account() {
  //-- State, Context, Custom Hooks --//
  const [copyConfirm, setCopyConfirm] = useState<boolean>(false);
  const { user } = useAuth0();
  const [clipboardValue, copyToClipboard] = useCopyToClipboard();

  //-- Other --//

  //-- Side Effects --//

  //-- Handlers --//
  const copyHandler = async (contentToCopy: string) => {
    copyToClipboard(contentToCopy);

    setCopyConfirm(true);
    setTimeout(() => {
      setCopyConfirm(false);
    }, 500);
  };

  //-- Check if using email + password sign in or google account oauth2 sync --//
  let oauth2: boolean = false;
  let oauth2Provider: string = "";
  if (user?.sub?.startsWith("google-oauth2")) {
    oauth2 = true;
    oauth2Provider = "Google";
  }

  return (
    <div className="divide-y divide-zinc-200 px-2 py-2 dark:divide-zinc-500">
      {/*-- START OF IDENTITY SECTION --*/}
      <div className="mb-2 grid grid-cols-3 gap-y-4 lg:mb-4 lg:gap-y-0">
        {/* START OF LHS */}
        <div className="col-span-3 lg:col-span-1">
          <h2 className="font-semibold text-zinc-700 dark:text-white">
            Identity
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Basic information about you
          </p>
        </div>
        {/* END OF LHS */}

        {/* START OF RHS */}
        <div className="col-span-3 mb-2 lg:col-span-2">
          <div className="flex flex-row justify-start gap-x-4 lg:gap-x-8">
            <img
              src={user?.picture}
              referrerPolicy="no-referrer" //-- Prevents intermittent 403 error, https://community.auth0.com/t/google-account-picture-request-forbidden/42031/11 --//
              alt={user?.name}
              className="mt-1.5 h-24 w-24 rounded-lg object-cover"
            />
            <div>
              {/* Name */}
              <h2 className="mt-2.5 text-2xl font-semibold text-zinc-800 dark:text-white">
                {user?.name}
              </h2>
              {/* Email */}
              <h2 className="mt-2 text-sm text-zinc-600 dark:text-zinc-200">
                {user?.email}
              </h2>
              {/* Sync note */}
              <div className="mt-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                {oauth2 && <p>Synced from your {oauth2Provider} account</p>}
              </div>
              {/* Instructions for changing password */}
              {!oauth2 && (
                <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                  <span className="italic">To change your password:</span>
                  <br />
                  Sign Out, then go to the Sign In page and select "Forgot
                  Password"
                </p>
              )}
            </div>
          </div>
        </div>
        {/* END OF RHS */}
      </div>
      {/* END OF IDENTITY SECTION */}

      {/*-- START OF SUBSCRIPTION SECTION --*/}
      <div className="mb-2 grid grid-cols-3 gap-y-4 pt-5 lg:mb-4 lg:gap-y-0">
        {/* START OF LHS/TOP */}
        <div className="col-span-3 lg:col-span-1">
          <h2 className="font-semibold text-zinc-700 dark:text-white">
            Active Subscriptions
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Your access to CHRT services
          </p>
        </div>
        {/* END OF LHS/TOP */}

        {/* START OF RHS/BOTTOM */}
        <div className="col-span-3 flex flex-col lg:col-span-2">
          {/*-- Show active subscriptions --*/}
          <ActiveSubscriptionsWithFallback />
        </div>
        {/* END OF RHS/BOTTOM */}
      </div>
      {/* END OF SUBSCRIPTION SECTION */}

      {/*-- START OF DELETE ACCOUNT SECTION --*/}
      <div className="mb-2 grid grid-cols-3 gap-y-4 pt-5 lg:mb-4 lg:gap-y-0">
        {/* START OF LHS */}
        <div className="col-span-3 lg:col-span-1">
          <h2 className="text-base font-semibold leading-7 text-zinc-700 dark:text-white">
            Delete account
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            No longer want to use our services? You can delete your account by
            sending a request to support@chrt.com.
          </p>
        </div>
        {/* END OF LHS */}

        {/* START OF RHS */}
        <div className="col-span-3 flex w-80 flex-col gap-2 lg:col-span-2">
          <button
            type="button"
            onClick={() => {
              copyHandler("support@chrt.com");
            }}
            className={classNames(
              "flex flex-row items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ",
              copyConfirm
                ? "animate-pulse bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200"
                : "bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-100 dark:bg-fuchsia-900 dark:text-fuchsia-100 dark:hover:bg-fuchsia-800"
            )}
          >
            support@chrt.com
            <ClipboardDocumentIcon
              className="ml-2 h-6 w-6"
              aria-hidden="true"
            />
          </button>
          <a
            href={`mailto:support@chrt.com?subject=${encodeURIComponent(
              `Delete Account for user ${user?.email}`
            )}&body=${encodeURIComponent(
              "Please delete my account. Thank you!"
            )}`}
            className="rounded-md bg-fuchsia-100 px-2.5 py-1.5 text-center text-sm font-semibold text-fuchsia-600 shadow-sm hover:bg-fuchsia-100 dark:bg-fuchsia-900 dark:text-fuchsia-100 dark:hover:bg-fuchsia-800"
          >
            Open "Delete Account" Email Draft
          </a>
        </div>
        {/* END OF LHS */}
      </div>
      {/* END OF DELETE ACCOUNT SECTION */}
    </div>
  );
}
