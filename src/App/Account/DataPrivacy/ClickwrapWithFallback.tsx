//== react, react-router-dom, Auth0 ==//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import ClickwrapGrant from "./ClickwrapGrant";
import ClickwrapAgreements from "./ClickwrapAgreements";
import { useAccountContext } from "../../../Context/AccountContext";
import { throwAxiosError } from "../../../Errors/throwAxiosError";
import { getErrorDetails } from "../../../Errors/getErrorDetails";
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";
import { getClickwrapUserStatus } from "./getClickwrapUserStatus";
//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios, { AxiosError } from "axios";

//== Utility Functions ==//
import classNames from "../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IClickwrapUserStatus } from "./clickwrap_types";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

// TODO - CCPA/CRPA
// // right to know
// // right to delete
// // right to opt-out
// // right to non-discrimination
// // right to correct
// // right to limit

// TODO - GDPR
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

  const fetchClickwrapUserStatus = async () => {
    //-- Get access token from memory or request new token --//
    let accessToken = await getAccessTokenSilently();
    try {
      await getClickwrapUserStatus(accessToken, AccountContext);
    } catch (err) {
      showBoundary(err);
    }
  };

  //== Side Effects ==//
  //-- On mount, get user clickwrap status --//
  useEffect(() => {
    fetchClickwrapUserStatus();
  }, []);

  //== Event Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      {/*-- Before fetch, show skeleton --*/}
      {!AccountContext.clickwrapStatusFetched ? (
        <div className="flex h-32 max-w-sm animate-pulse items-center justify-center rounded-lg bg-zinc-200">
          <p className="text-zinc-500">Loading...</p>
        </div>
      ) : AccountContext.clickwrapStatusChanging ? (
        <div className="flex h-32 max-w-sm animate-pulse items-center justify-center rounded-lg bg-zinc-200">
          <p className="text-zinc-500">Updating...</p>
        </div>
      ) : // -- Else if status fetched and inactive, show clickwrap form --//
      AccountContext.clickwrapStatusFetched &&
        !AccountContext.clickwrapActive ? (
        <ClickwrapGrant />
      ) : //-- Else if clickwrap status is active, show list of agreements --//
      AccountContext.clickwrapStatusFetched &&
        AccountContext.clickwrapActive ? (
        <ClickwrapAgreements />
      ) : (
        <></>
      )}
    </>
  );
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
  const is401Error = axiosHTTPStatus === "401";

  //-- 401 errors --//
  if (is401Error) {
    return (
      <div>
        <p>{axiosHTTPStatus}</p>
      </div>
    );
  }
  //-- non-401 errors --//
  else {
    return (
      <div>
        <p>{errorMessage}</p>
        <p>{axiosServerMessage}</p>
        <p>{axiosHTTPStatus}</p>
        <p>{axiosHTTPStatusText}</p>
      </div>
    );
  }
};
