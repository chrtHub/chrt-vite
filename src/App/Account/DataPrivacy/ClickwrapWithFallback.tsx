//== react, react-router-dom, Auth0 ==//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import ClickwrapForm from "./ClickwrapForm";
import ClickwrapAgreements from "./ClickwrapAgreements";
import { useAccountContext } from "../../../Context/AccountContext";
import { throwAxiosError } from "../../../Errors/throwAxiosError";
import { getErrorDetails } from "../../../Errors/getErrorDetails";
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";

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

  const getClickwrapUserStatus = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      let res = await axios.get(`${VITE_ALB_BASE_URL}/legal/clickwrap_status`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const data: IClickwrapUserStatus = res.data;
      AccountContext.setClickwrapActive(data.activeAgreement);
      AccountContext.setClickwrapAgreements(data.agreements);
      AccountContext.setClickwrapStatusFetched(true);
      //----//
    } catch (err) {
      console.log(err); // DEV
      showBoundary(err);
    }
  };

  //== Side Effects ==//
  //-- On mount, get user clickwrap status --//
  useEffect(() => {
    getClickwrapUserStatus();
  }, []);

  //== Event Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      {/*-- Before fetch, show skeleton --*/}
      {!AccountContext.clickwrapStatusFetched ? (
        <div>skeleton</div>
      ) : // -- Else if status fetched and inactive, show clickwrap form --//
      AccountContext.clickwrapStatusFetched &&
        !AccountContext.clickwrapActive ? (
        <ClickwrapForm />
      ) : //-- Else if clickwrap status is active, show list of agreements --//
      AccountContext.clickwrapStatusFetched &&
        AccountContext.clickwrapActive ? (
        <ClickwrapAgreements />
      ) : (
        <p>foo</p>
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
