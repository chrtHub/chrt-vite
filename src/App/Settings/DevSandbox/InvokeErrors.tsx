import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getErrorDetails } from "../../../Errors/getErrorDetails";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

export interface ErrorType {
  name: string;
  httpStatus?: string;
  networkError?: boolean;
  fakeRoute?: boolean;
  useRouteBoundary?: boolean;
  toast?: boolean;
}
const ErrorTypes: ErrorType[] = [
  {
    name: "try-catch --> route's error boundary",
    useRouteBoundary: true,
  },
  {
    name: "try-catch --> component's error boundary",
  },
  {
    name: "try-catch --> toast",
    toast: true,
  },
  {
    name: "Bad Request",
    httpStatus: "400",
  },
  {
    name: "Unauthorized",
    httpStatus: "401",
  },
  {
    name: "Forbidden",
    httpStatus: "403",
  },
  {
    name: "I'm a Teapot",
    httpStatus: "418",
  },
  {
    name: "Internal Server Error",
    httpStatus: "500",
  },
  {
    name: "Non-existent Route",
    fakeRoute: true,
  },
  {
    name: "Network Error (request to non-existent server)",
    networkError: true,
  },
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function InvokeErrors() {
  return (
    <div className="flex w-full max-w-prose flex-col gap-2">
      {/* Map error types into components with buttons that invoke an error */}
      {ErrorTypes.map((errorType, index) => {
        return <ErrorComponentWithFallback errorType={errorType} key={index} />;
      })}
    </div>
  );
}

//-- ***** ***** ***** Error Section Component Stuff ***** ***** ***** --//
//-- Component in Error Boundary + Fallback --//
interface IProps {
  errorType: ErrorType;
}
const ErrorComponentWithFallback = ({ errorType }: IProps) => {
  //-- Component --//
  const ComponentWithError = () => {
    const { showBoundary } = useErrorBoundary();
    const { getAccessTokenSilently } = useAuth0();

    //-- Throw error and pass the error to showBoundary --//
    const invokeErrorHandler = async () => {
      //-- For errorType with httpStatus, make axios request --//
      if (errorType.httpStatus) {
        try {
          //-- Get access token from memory or request new token --//
          let accessToken = await getAccessTokenSilently();

          //-- Make GET request --//
          let res = await axios.get(
            `${VITE_ALB_BASE_URL}/error/${errorType.httpStatus}`,
            {
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("Request succeeded, res.data: ", res.data); //-- Expected not to fire due to test error --//
        } catch (err) {
          showBoundary(err);
        }
      }
      //-- Else is fake route error, call a non-existent route --//
      else if (errorType.fakeRoute) {
        try {
          await axios.get(`${VITE_ALB_BASE_URL}/this_route_does_not_exist`);
        } catch (err) {
          showBoundary(err);
        }
      }
      //-- Else is network error, call a non-existent server --//
      else if (errorType.networkError) {
        try {
          await axios.get(`https://NotARealServer.chrt.com/`);
        } catch (err) {
          showBoundary(err);
        }
      }

      //-- Else if no errorType has no httpStatus, directly throw error --//
      else {
        try {
          throw new Error("hello, this is an example of a try-catch error");
        } catch (err) {
          //-- Toast --//
          if (errorType.toast) {
            if (err instanceof Error) {
              toast(err.message);
            }
          } //-- Error Boundary --//
          else {
            showBoundary(err);
          }
        }
      }
    };

    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-zinc-200 p-2 dark:bg-zinc-800 dark:text-zinc-200">
        {/* Title */}
        <p className="text-md">
          {errorType.httpStatus && (
            <span>
              {errorType.httpStatus}
              {" - "}
            </span>
          )}
          {errorType.name}
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={invokeErrorHandler}
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

  //-- Fallback Component --//
  const Fallback = ({ error }: { error: Error | AxiosError }) => {
    const { resetBoundary } = useErrorBoundary();

    const {
      errorMessage,
      isAxiosError,
      axiosServerMessage,
      axiosHTTPStatus,
      axiosHTTPStatusText,
    } = getErrorDetails(error);

    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-orange-200 p-2">
        {/* Title */}
        {/* <p className="text-md">{errorType.name} Error Caught</p> */}
        <p className="text-md">
          {errorType.httpStatus && (
            <span>
              {errorType.httpStatus}
              {" - "}
            </span>
          )}
          {errorType.name}
        </p>

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
            <span className="font-semibold text-zinc-900">Data: </span>{" "}
            {axiosServerMessage}
          </p>

          <p className="text-zinc-600">
            <span className="font-semibold text-zinc-900">HTTP Status: </span>
            {axiosHTTPStatus}
          </p>

          <p className="text-zinc-600">
            <span className="font-semibold text-zinc-900">
              HTTP Status Text:{" "}
            </span>
            {axiosHTTPStatusText}
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
  //-- Use route's error boundary --//
  if (errorType.useRouteBoundary === true) {
    return <ComponentWithError />;
  }
  //-- Use component's error boundary --//
  else {
    return (
      <ErrorBoundary FallbackComponent={Fallback}>
        <ComponentWithError />
      </ErrorBoundary>
    );
  }
};
