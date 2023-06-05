import { getErrorDetails } from "../../Errors/getErrorDetails";

import { useNavigate } from "react-router-dom";

export const ChatRowAreaFallback = ({ error }: { error: Error }) => {
  const {
    errorMessage,
    isAxiosError,
    axiosServerMessage,
    axiosHTTPStatus,
    axiosHTTPStatusText,
  } = getErrorDetails(error);
  const is401Error = axiosHTTPStatus === "401";

  let navigate = useNavigate();

  if (is401Error) {
    return (
      <div className="flex w-full flex-grow flex-row justify-center">
        <div className="flex w-full max-w-prose flex-col justify-center rounded-lg bg-zinc-300 text-center dark:bg-zinc-500">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-4xl">
            Start using ChrtGPT today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-200">
            Request free access to the preview release
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => navigate("/account")}
              className="text-md rounded-md bg-green-600 px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Get Access <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full flex-grow flex-row justify-center">
        <div className="flex w-full max-w-prose flex-col justify-center rounded-lg bg-zinc-100 text-center dark:bg-zinc-900">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {errorMessage}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {axiosHTTPStatus} {axiosHTTPStatusText}
          </p>
        </div>
      </div>
    );
  }
};
