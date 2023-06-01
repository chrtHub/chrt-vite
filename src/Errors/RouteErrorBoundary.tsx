import { Link, useNavigate, useRouteError } from "react-router-dom";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
// import { useErrorBoundary } from "react-error-boundary";

export default function RouteErrorBoundary() {
  // const navigate = useNavigate();

  const homeButtonRef = useRef(null);

  //-- react-router --//
  let error = useRouteError();
  let errorString: string = "";
  if (error) {
    try {
      errorString = error.toString();
    } catch (err) {
      console.log(err);
    }
  }

  //-- react-error-boundary --//
  // const { resetBoundary } = useErrorBoundary(); // DEV - (when) is this useful??

  return (
    <Transition.Root show={true} as={Fragment}>
      {/* <Transition.Root show={open} as={Fragment}> */}
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={homeButtonRef}
        onClose={() => {}}
        // onClose={() => {
        //   navigate("/");
        // }}
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
          <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity dark:bg-zinc-800" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-50 px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-zinc-900 sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-orange-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-50"
                    >
                      Sorry, an error occured
                    </Dialog.Title>
                    <div className="mt-2">
                      {/* <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-300">
                        First, try resetting the application by clicking the
                        button below.
                      </p> */}
                      <p className="text-sm text-zinc-500 dark:text-zinc-300">
                        If problems persist, please email{" "}
                        <span>
                          <a
                            href="mailto:support@chrt.com"
                            className="underline. text-blue-500 dark:text-blue-400"
                          >
                            support@chrt.com
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-row justify-end">
                  <Link
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    to="/"
                    ref={homeButtonRef}
                  >
                    Home
                  </Link>
                  {/* <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      resetBoundary(); // DEV - needed??
                    }}
                  >
                    Reset App
                  </button> */}
                </div>
                <div className="mt-4 border-t-2 border-zinc-500" />
                <div className="mt-4 rounded-md  bg-zinc-950 p-4 font-mono text-sm text-zinc-50">
                  <p>{errorString}</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
