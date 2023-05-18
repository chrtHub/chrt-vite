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

  //-- Error Button Fallback --//
  const Fallback = ({ error }: { error: Error | AxiosError }) => {
    const { resetBoundary } = useErrorBoundary();

    const errorMessage = error.message;
    const data = error instanceof AxiosError ? error.response?.data : "";
    const httpStatus =
      error instanceof AxiosError ? error.response?.status : "";
    const httpStatusText =
      error instanceof AxiosError ? error.response?.statusText : "";

    // DEV - test this
    console.log(errorMessage);
    console.log(data);
    console.log(httpStatus);
    console.log(httpStatusText);

    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-orange-200 p-2">
        {/* Title */}
        <p className="text-md">Backend 500 Error Caught</p>

        {/* TODO  */}
        <div className="text-md flex w-full flex-col justify-start font-mono">
          <div>
            <p className="text-zinc-600">
              <span className="font-semibold text-zinc-900">message: </span>
              {errorMessage}
            </p>
          </div>
          <p className="text-zinc-600">
            <span className="font-semibold text-zinc-900">data: </span> {data}
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
