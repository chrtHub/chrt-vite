//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components and Functions --//
import { useAccountContext } from "../../Context/AccountContext";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Account() {
  //-- State, Context, Custom Hooks --//
  let AccountContext = useAccountContext();
  const { getAccessTokenSilently, user } = useAuth0();

  //-- Other --//

  //-- Side Effects --//

  //-- Handlers --//

  //-- Check if using email + password sign in or google account oauth2 sync --//
  let oauth2: boolean = false;
  let oauth2Provider: string = "";
  if (user?.sub?.startsWith("google-oauth2")) {
    oauth2 = true;
    oauth2Provider = "Google";
  }

  return (
    <div className="divide-y divide-zinc-300 px-2 py-2">
      {/*-- Identity Section --*/}
      <div className="mb-2 grid grid-cols-1 gap-y-4 md:mb-4 md:grid-cols-3 md:gap-y-0">
        {/* LHS */}
        <div className="md:col-span-1">
          <h2 className="font-semibold text-zinc-700 dark:text-white">
            Identity
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Basic information about you
          </p>
        </div>

        {/* RHS */}
        <div className="md:col-span-2">
          <div className="mb-4 grid grid-cols-1">
            <div className="col-span-full flex items-center gap-x-8">
              <img
                src={user?.picture}
                alt={user?.name}
                className="h-24 w-24 flex-none rounded-lg bg-zinc-800 object-cover"
              />
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-zinc-800 dark:text-white">
                  {user?.name}
                </h2>
                <h2 className="mb-2 text-sm text-zinc-600 dark:text-zinc-200">
                  {user?.email}
                </h2>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {oauth2 && <p>Synced from your {oauth2Provider} account</p>}
                </div>
                {!oauth2 && (
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    <span className="italic">To change your password:</span>
                    <br />
                    Sign Out, then go to the Sign In page and select "Forgot
                    Password"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*-- Subscriptions Section --*/}
      <div className="mb-2 grid grid-cols-1 gap-y-4 pt-5 md:mb-4 md:grid-cols-3 md:gap-y-0">
        {/* LHS */}
        <div>
          <h2 className="font-semibold text-zinc-700 dark:text-white">
            Active Subscriptions
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Your access to CHRT services
          </p>
        </div>

        {/* RHS */}
        <div className="md:col-span-2">
          <div className="mb-4 grid grid-cols-1">
            <div className="flex flex-col items-center gap-4">
              {/* Subscription Cards */}
              {AccountContext.roles.map((role, idx) => (
                <div
                  key={idx}
                  className="flex w-full flex-col rounded-lg bg-white p-6 shadow md:flex-row"
                >
                  {/* Subscription Name */}
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    {role.role_name}
                  </h3>
                  {/*  */}
                  <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                    <div className="max-w-xl text-sm text-gray-500">
                      <p>{role.role_description}</p>
                    </div>
                    {/* Subscription Permissions */}
                    <ul className="list-disc pl-5 text-zinc-500">
                      {role.permissions.map((permission, jdx) => (
                        <li key={jdx}>{permission}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                //-- End of subscription cards --//
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {/* LHS */}
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-700 dark:text-white">
            Delete account
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            No longer want to use our services? You can delete your account by
            sending a request to support@chrt.com.
          </p>
        </div>

        {/* RHS */}
        <div className="flex items-start md:col-span-2">
          <button
            type="button"
            className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
          >
            Copy Email Address
          </button>

          <button
            type="button"
            className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
          >
            Open Email
          </button>
        </div>
      </div>
    </div>
  );
}
