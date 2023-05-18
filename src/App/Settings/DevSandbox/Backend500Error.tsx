import { useState } from "react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosError } from "axios";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Backend500Error() {
  //-- Error Button --//
  const ComponentWithError = ({}) => {
    const { showBoundary } = useErrorBoundary();

    const { getAccessTokenSilently } = useAuth0();

    //-- Throw error and pass the error to showBoundary --//
    const throwErrorHandler = async () => {
      try {
        //-- Get access token from memory or request new token --//
        let accessToken = await getAccessTokenSilently();

        //-- Make GET request --//
        let res = await axios.get(`${VITE_ALB_BASE_URL}/error/500`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("Request succeeded, res.data: ", res.data); //-- Expected not to fire due to test error --//
      } catch (err) {
        showBoundary(err);
      }
    };

    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-zinc-200 p-2">
        {/* Title */}
        <p className="text-md">Backend 500 Error Section</p>

        {/* Button */}
        <button
          type="button"
          onClick={throwErrorHandler}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-orange-100 px-2.5 py-1.5 text-sm font-semibold text-orange-600 shadow-sm hover:bg-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          <ExclamationTriangleIcon
            className="-ml-0.5 h-5 w-5"
            aria-hidden="true"
          />
          Invoke Test Error
        </button>
      </div>
    );
  };

  const getErrorDetails = (error: Error | AxiosError) => {
    const errorMessage = error.message;
    const isAxiosError = error instanceof AxiosError ? "true" : "false";
    const data =
      error instanceof AxiosError
        ? typeof error.response?.data === "object"
          ? JSON.stringify(error.response?.data) || ""
          : String(error.response?.data || "")
        : "";
    const httpStatus =
      error instanceof AxiosError
        ? error.response?.status.toString() || ""
        : "";
    const httpStatusText =
      error instanceof AxiosError ? error.response?.statusText || "" : "";

    return { errorMessage, isAxiosError, data, httpStatus, httpStatusText };
  };

  //-- Error Button Fallback --//
  const Fallback = ({ error }: { error: Error | AxiosError }) => {
    const { resetBoundary } = useErrorBoundary();

    const { errorMessage, isAxiosError, data, httpStatus, httpStatusText } =
      getErrorDetails(error);

    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-orange-200 p-2">
        {/* Title */}
        <p className="text-md">Backend 500 Error Caught</p>
        {/* Error details */}
        <div className="text-md flex w-full flex-col justify-start font-mono">
          <div>
            <p className="text-zinc-600">
              <span className="font-semibold text-zinc-900">message: </span>
              {errorMessage}
            </p>
          </div>

          <div>
            <p className="text-zinc-600">
              <span className="font-semibold text-zinc-900">AxiosError: </span>
              {isAxiosError}
            </p>
          </div>

          <p className="text-zinc-600">
            <span className="font-semibold text-zinc-900">Data: </span> {data}
          </p>

          <p className="text-zinc-600">
            <span className="font-semibold text-zinc-900">HTTP Status: </span>
            {httpStatus}
          </p>

          <p className="text-zinc-600">
            <span className="font-semibold text-zinc-900">
              HTTP Status Text:{" "}
            </span>
            {httpStatusText}
          </p>
        </div>
        {/* Button */}
        <button
          type="button"
          onClick={resetBoundary}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-zinc-100 px-2.5 py-1.5 text-sm font-semibold text-zinc-600 shadow-sm hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
        >
          <ArrowPathIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Reset Error State
        </button>
      </div>
    );
  };

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ComponentWithError />
    </ErrorBoundary>
  );
}
