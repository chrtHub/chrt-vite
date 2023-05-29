//== react, react-router-dom, recoil, Auth0 ==//
import { useEffect, Fragment, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

//== TSX Components, Functions ==//
import { getPermissions } from "../../Auth/getPermissions";
import { ErrorBoundary } from "react-error-boundary";
import { throwAxiosError } from "../../Errors/throwAxiosError";
import { getErrorDetails } from "../../Errors/getErrorDetails";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import { useErrorBoundary } from "react-error-boundary";
import { PlayIcon } from "@heroicons/react/24/solid";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ComponentName() {
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
  const [modalOpen, setModalOpen] = useState(true);

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
      <div className="relative">
        <Transition.Root show={modalOpen} as={Fragment}>
          {/* <Dialog as="div" className="relative z-10" onClose={setModalOpen}> */}
          <Dialog
            as="div"
            className="absolute inset-0 z-10"
            onClose={setModalOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* <div className="fixed inset-0 bg-zinc-500 bg-opacity-40 transition-opacity" /> */}
              <div className="absolute inset-0 bg-zinc-500 bg-opacity-40 transition-opacity" />
            </Transition.Child>

            {/* <div className="fixed inset-0 z-10 overflow-y-auto"> */}
            <div className="absolute inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 lg:max-w-lg">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <PlayIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
                        >
                          Start using CHRT Journal Today
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-md text-zinc-600 dark:text-zinc-400">
                            Request free access to the preview release
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        onClick={() => setModalOpen(false)}
                      >
                        Get Access{" "}
                        <span className="ml-1" aria-hidden="true">
                          →
                        </span>
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    );
  } else {
    return <></>;
  }
};
