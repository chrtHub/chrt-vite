//== react, react-router-dom, Auth0 ==//
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";
import { ErrorBoundary } from "react-error-boundary";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//
import { getUsersPermissions } from "../Subscriptions/Util/getUserPermissions";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ActiveSubscriptionsWithFallback() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Component />
    </ErrorBoundary>
  );
}

//-- ***** ***** ***** COMPONENT ***** ***** ***** --//
const Component = () => {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();

  const { showBoundary } = useErrorBoundary();
  const { getAccessTokenSilently } = useAuth0();

  //== Auth ==//

  //== Other ==//
  async function fetchPermissions() {
    let accessToken = await getAccessTokenSilently();
    try {
      await getUsersPermissions(accessToken, AccountContext);
    } catch (err) {
      showBoundary(err);
    }
    AccountContext.setRolesFetched(true);
  }

  //== Side Effects ==//
  //-- On mount, get user permissions --//
  useEffect(() => {
    fetchPermissions();
  }, []);

  //== Event Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
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
    </>
  );
};

//-- ***** ***** ***** FALLBACK ***** ***** ***** --//
const Fallback = () => {
  return (
    <div>
      <div className="mb-3 flex h-28 flex-col items-center justify-center rounded-lg bg-yellow-200 shadow dark:bg-yellow-900">
        <p className="text-base font-semibold text-zinc-600 dark:text-zinc-100">
          Auth Server temporarily unavailable
        </p>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-200">
          Please refresh the page to try again
        </p>
      </div>
    </div>
  );
};
