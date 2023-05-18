//-- react, react-router-dom, Auth0 --//
import { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useErrorBoundary } from "react-error-boundary";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Settings() {
  const { showBoundary } = useErrorBoundary();

  const showErrorHandler = () => {
    try {
      throw new Error("Foo - This is a test error");
    } catch (err) {
      showBoundary(err);
    }
  };

  return (
    <>
      <div>settings</div>
      <button
        type="button"
        onClick={showErrorHandler}
        className="inline-flex items-center gap-x-1.5 rounded-md bg-orange-100 px-2.5 py-1.5 text-sm font-semibold text-orange-600 shadow-sm hover:bg-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        <ExclamationTriangleIcon
          className="-ml-0.5 h-5 w-5"
          aria-hidden="true"
        />
        Invoke Test Error
      </button>
    </>
  );
}
