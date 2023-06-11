//== react, react-router-dom, Auth0 ==//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import GrantConsentForm from "./GrantConsentForm";
import ActiveAgreements from "./ActiveAgreements";
import { useAccountContext } from "../../../../Context/AccountContext";
import { getErrorDetails } from "../../../../Errors/getErrorDetails";
import { getUserClickwrapData } from "./Util/getUserClickwrapData";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// TODO
// Cookies list
// Data request - request email link to download all your data
// CCPA/CRPA
// // right to know
// // right to delete
// // right to opt-out
// // right to non-discrimination
// // right to correct
// // right to limit
// GDPR
// <<>>

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ComponentNameWithFallback() {
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

  //== Auth ==//
  let { getAccessTokenSilently, user } = useAuth0();

  //== Other ==//
  // throwAxiosError(400); // DEV

  const fetchClickwrapUserData = async () => {
    let accessToken = await getAccessTokenSilently();
    try {
      await getUserClickwrapData(accessToken, AccountContext);
    } catch (err) {
      showBoundary(err);
    }
  };

  //== Side Effects ==//
  //-- On mount, get user's clickwrap status --//
  useEffect(() => {
    fetchClickwrapUserData();
  }, []);

  //== Event Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  //-- Else if status is changing, show "Updating..." skeleton --//
  if (AccountContext.clickwrapStatusChanging) {
    return (
      <div className="flex h-32 max-w-lg animate-pulse items-center justify-center rounded-lg bg-zinc-200">
        <p className="text-zinc-500">Updating...</p>
      </div>
    );
  }
  //-- Before fetch, show "Loading..." skeleton --//
  else if (!AccountContext.clickwrapStatusFetched) {
    return (
      <div className="flex h-32 max-w-lg animate-pulse items-center justify-center rounded-lg bg-zinc-200">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }
  //-- Else if status fetched and inactive, show clickwrap form --//
  else if (
    AccountContext.clickwrapStatusFetched &&
    !AccountContext.clickwrapIsActive
  ) {
    return <GrantConsentForm />;
  }
  //-- Else if clickwrap status is active, show list of agreements --//
  else if (
    AccountContext.clickwrapStatusFetched &&
    AccountContext.clickwrapIsActive
  ) {
    return <ActiveAgreements />;
  }
  //-- For type safety, always return something --//
  return <></>;
};

//-- ***** ***** ***** FALLBACK ***** ***** ***** --//
const Fallback = ({ error }: { error: Error }) => {
  const {
    errorMessage,
    isAxiosError,
    axiosServerMessage,
    axiosHTTPStatus,
    axiosHTTPStatusText,
  } = getErrorDetails(error);

  //-- Generic error skeleton with message and icon --//
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-amber-200 py-3 text-center ring-1 ring-inset ring-amber-300 dark:bg-amber-900">
      {/* Icon */}
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-300">
        <ExclamationTriangleIcon
          className="h-6 w-6 text-amber-700"
          aria-hidden="true"
        />
      </div>
      {/* Text */}
      <div className="mx-auto px-8">
        <p className="mt-3 text-base font-semibold text-zinc-600 dark:text-zinc-100">
          Server temporarily unavailable
        </p>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-200">
          Please refresh the page to try again
        </p>
        <p className="mt-2 text-base italic text-zinc-400 dark:text-zinc-300">
          {axiosHTTPStatus}
        </p>
      </div>
    </div>
  );
};
