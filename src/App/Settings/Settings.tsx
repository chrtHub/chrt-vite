//-- react, react-router-dom, Auth0 --//
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Settings() {
  //-- Button that causes an error --//
  const ButtonCausingError = () => {
    //-- NOTE - `showBoundary` must be destructed and called within `ButtonCausingError`, not `Settings`, otherwise the error boundary for `Settings` will be called --//
    const { showBoundary } = useErrorBoundary();

    //-- Throw error and pass the error to showBoundary --//
    const throwErrorHandler = () => {
      try {
        throw new Error("Foo - This is a test error");
      } catch (err) {
        showBoundary(err);
      }
    };

    return (
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
    );
  };

  //-- Error Fallback Component --//
  const Fallback = () => {
    return (
      <div>
        <p>Error!</p>
      </div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <div>Settings</div>
      <ButtonCausingError />
    </ErrorBoundary>
  );
}
