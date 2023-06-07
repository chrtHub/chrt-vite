//== react, react-router-dom, Auth0 ==//
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components, Functions ==//
import { getPermissions } from "../../Auth/getPermissions";
import { ErrorBoundary } from "react-error-boundary";
import { throwAxiosError } from "../../Errors/throwAxiosError";
import { getErrorDetails } from "../../Errors/getErrorDetails";

//== NPM Components ==//

//== Icons ==//
import { PlusIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//
import { useErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function CTA401Fallback() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Component />
    </ErrorBoundary>
  );
}
//== ***** ***** ***** ***** ***** ***** ***** ***** ***** ==//

const Component = () => {
  //== React State, Custom Hooks ==//
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//

  //== Event Handlers ==//

  //-- On mount, check if accessToken permissions include "write:journal" --//
  useEffect(() => {
    lambda();
  }, []);

  const lambda = async () => {
    const accessToken = await getAccessTokenSilently();
    const permissions = await getPermissions(accessToken);
    try {
      if (!permissions.includes("write:journal")) {
        throwAxiosError(401);
      }
    } catch (err) {
      showBoundary(err);
    }
  };
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return <></>;
};

const Fallback = ({ error }: { error: Error }) => {
  const {
    errorMessage,
    isAxiosError,
    axiosServerMessage,
    axiosHTTPStatus,
    axiosHTTPStatusText,
  } = getErrorDetails(error);
  const is401Error = axiosHTTPStatus === "401";

  let navigate = useNavigate();

  //-- 401 errors --//
  if (is401Error) {
    return (
      <>
        <div className="mb-6 rounded-lg bg-zinc-300 dark:bg-zinc-500">
          <div className="px-12 py-12">
            <div className="mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-4xl">
                Start using CHRT Journal Today
              </h2>
              <p className="mx-auto mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-200">
                Request free access to the preview release
              </p>
              <div className="mt-6 flex items-center justify-center">
                <button
                  onClick={() => navigate("/account")}
                  className="text-md rounded-md bg-green-600 px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Get Access <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
};
