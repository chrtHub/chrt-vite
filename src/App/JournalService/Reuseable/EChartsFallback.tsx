//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { getErrorDetails } from "../../../Errors/getErrorDetails";

//== NPM Components ==//

//== Icons ==//
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export const EChartsFallback = ({ error }: { error: Error }) => {
  //-- Error info --//
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
  else if (false) {
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
      <div
        className={classNames(
          "mb-1 mt-3 flex h-full w-full flex-col items-center justify-center overflow-y-scroll rounded-2xl p-6 text-center",
          "ring-1 ring-inset ring-amber-100",
          "bg-amber-50 dark:bg-amber-950 dark:ring-amber-900"
        )}
      >
        {/* Icon */}
        <div className="mx-auto mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 dark:bg-amber-900">
          <ExclamationTriangleIcon
            className="h-6 w-6 text-amber-700 dark:text-amber-500"
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
