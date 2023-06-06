//-- react, react-router-dom, Auth0 --//
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components and Functions --//
import { useAccountContext } from "../../Context/AccountContext";
import { NavLink } from "react-router-dom";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import { useCopyToClipboard } from "usehooks-ts";
import classNames from "../../Util/classNames";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

//-- Utility Functions --//

//-- Data Objects, Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Account() {
  //-- State, Context, Custom Hooks --//
  const [copyConfirm, setCopyConfirm] = useState<boolean>(false);
  let AccountContext = useAccountContext();
  const { getAccessTokenSilently, user } = useAuth0();
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
    <div className="divide-y divide-zinc-300 px-2 py-2">
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
          {/* Before roles are fetched, show pulsing skeleton */}
          {!AccountContext.rolesFetched ? (
            <div className="mb-3 flex h-28 animate-pulse rounded-lg bg-zinc-200 shadow dark:bg-zinc-700" />
          ) : //-- If roles are fetched but 0 exist, indicate that --//
          AccountContext.roles.length === 0 ? (
            <div className="mb-3 flex h-28 flex-col items-center justify-center rounded-lg bg-zinc-200 shadow dark:bg-zinc-700">
              <p className="mb-2 font-semibold italic text-zinc-600 dark:text-zinc-200">
                No Active Subscriptions
              </p>
              <NavLink
                to={"/account/subscriptions"}
                className="w-52 rounded bg-green-600 px-2 py-1 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Choose a subscription
              </NavLink>
            </div>
          ) : (
            //-- Show active subscriptions --//
            <>
              {AccountContext.roles.map((role, idx) => (
                //-- Start of Subscription Cards --//
                <div
                  key={idx}
                  className="mb-3 flex w-full rounded-lg bg-white p-6 shadow dark:bg-zinc-800"
                >
                  <div className="grid w-full grid-cols-2">
                    {/* LHS */}
                    <div className="col-span-2 lg:col-span-1">
                      {/* Subscription Name */}
                      <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
                        {role.role_name}
                      </h3>
                      {/* Description  */}
                      <div className="mb-2 max-w-xl text-sm text-zinc-500 dark:text-zinc-300">
                        <p>{role.role_description}</p>
                      </div>
                    </div>

                    {/* RHS */}
                    <div className="col-span-2 lg:col-span-1">
                      {/* Subscription Permissions */}
                      <h2 className="font-medium text-zinc-800 dark:text-zinc-200">
                        API Permissions:
                      </h2>
                      <ul className="list-disc pl-5 text-zinc-500 dark:text-zinc-300">
                        {role.permissions.map((permission, jdx) => (
                          <li key={jdx}>{permission}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                //-- End of subscription cards --//
              ))}
            </>
          )}
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
        <div className="col-span-3 flex w-64 flex-col gap-2 lg:col-span-2">
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
            href="mailto:support@chrt.com"
            className="rounded-md bg-fuchsia-100 px-2.5 py-1.5 text-center text-sm font-semibold text-fuchsia-600 shadow-sm hover:bg-fuchsia-100 dark:bg-fuchsia-900 dark:text-fuchsia-100 dark:hover:bg-fuchsia-800"
          >
            Open Default Email Client
          </a>
        </div>
        {/* END OF LHS */}
      </div>
      {/* END OF DELETE ACCOUNT SECTION */}
    </div>
  );
}
