import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

//-- Error Button --//
const ComponentWithError = () => {
  const { showBoundary } = useErrorBoundary();
  //-- Throw error and pass the error to showBoundary --//
  const throwErrorHandler = () => {
    try {
      throw new Error("hello, this is an example of a try-catch error");
    } catch (err) {
      showBoundary(err);
    }
  };
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-zinc-200 p-2">
      {/* Title */}
      <p className="text-md">Try-Catch Error Section</p>

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
const Fallback = () => {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-orange-200 p-2">
      {/* Title */}
      <p className="text-md">Try-Catch Error Caught</p>

      {/* Button */}
      <button
        type="button"
        onClick={resetBoundary}
        className="inline-flex items-center gap-x-1.5 rounded-md bg-zinc-100 px-2.5 py-1.5 text-sm font-semibold text-zinc-600 shadow-sm hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
      >
        <InformationCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Reset Error State
      </button>
    </div>
  );
};

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function TryCatchError() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ComponentWithError />
    </ErrorBoundary>
  );
}
