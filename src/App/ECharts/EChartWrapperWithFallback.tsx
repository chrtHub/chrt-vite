//== react, react-router-dom, Auth0 ==//
import { PropsWithChildren } from "react";

//== TSX Components, Functions ==//
import { ErrorBoundary } from "react-error-boundary";
import { throwAxiosError } from "../../Errors/throwAxiosError";
import { getErrorDetails } from "../../Errors/getErrorDetails";

//== NPM Components ==//

//== Icons ==//
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  title: string;
  loading: boolean;
  height: string;
  width: string;
}
export default function EChartWrapperWithFallback(
  props: PropsWithChildren<IProps>
) {
  const { height, width } = props;
  return (
    <ErrorBoundary
      FallbackComponent={(fallbackProps) => (
        <Fallback {...fallbackProps} height={height} width={width} />
      )}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
}

//-- ***** ***** ***** COMPONENT ***** ***** ***** --//
const Component = ({
  children,
  title,
  loading,
  height,
  width,
}: PropsWithChildren<IProps>) => {
  //== React State, Custom Hooks ==//

  //== Auth ==//

  //== Other ==//
  const tw_height = `h-[${height}]`;
  const tw_width = `w-[${width}]`;

  //== Side Effects ==//

  //== Handlers ==//

  throwAxiosError(400); // DEV
  //   const _loading = true; // dev
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div
      className={classNames(
        "mt-1 rounded-2xl px-3 pb-3 pt-4",
        "shadow-md",
        "ring-1 ring-inset ring-zinc-800/10 dark:ring-zinc-100/10",
        loading
          ? "animate-pulse bg-zinc-100 dark:bg-zinc-800"
          : "bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100"
      )}
    >
      {/* Title */}
      <p className="text-center font-medium text-zinc-600 dark:text-zinc-200">
        {title}
      </p>
      {/* Chart */}
      {loading ? (
        <div className={classNames(`${tw_height} ${tw_width}`)} />
      ) : (
        children
      )}
    </div>
  );
};

//-- ***** ***** ***** FALLBACK ***** ***** ***** --//
const Fallback = ({
  error,
  height,
  width,
}: {
  error: Error;
  height: string;
  width: string;
}) => {
  //-- Height and width --//
  const tw_height = `h-[${height}]`;
  const tw_width = `w-[${width}]`;

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
          "flex flex-col items-center justify-center rounded-2xl py-3 text-center",
          `${tw_height} ${tw_width}`,
          "ring-1 ring-inset ring-amber-100",
          "bg-amber-50 dark:bg-amber-950 dark:ring-amber-900"
        )}
      >
        {/* Icon */}
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 dark:bg-amber-900">
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
