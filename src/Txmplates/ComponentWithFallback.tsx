//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { ErrorBoundary } from "react-error-boundary";
import { throwAxiosError } from "../Errors/throwAxiosError";
import { getErrorDetails } from "../Errors/getErrorDetails";

//== NPM Components ==//

//== Icons ==//
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

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
  //== Auth ==//
  //== Other ==//
  throwAxiosError(400); // DEV

  //== Side Effects ==//
  //== Event Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div>
      <p>foo</p>
    </div>
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
  else if (true) {
    //- Generic list of error data --//
    return (
      <div>
        <p>{errorMessage}</p>
        <p>{axiosServerMessage}</p>
        <p>{axiosHTTPStatus}</p>
        <p>{axiosHTTPStatusText}</p>
      </div>
    );
  } else {
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
  }
};
