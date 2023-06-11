//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useSiteContext } from "../../Context/SiteContext";

//-- TSX Components --//
import ErrorInvokers from "../../Errors/ErrorInvokers/ErrorInvokers";

//-- NPM Components --//
import { Popover } from "@headlessui/react";
import ReactJson, { ThemeKeys } from "react-json-view";

//-- Icons --//
import {
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

//-- NPM Functions --//
import { useCopyToClipboard } from "usehooks-ts";
import { usePopper } from "react-popper";
import jwtDecode from "jwt-decode";

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//-- Data Objects --//
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function DevResources() {
  let SiteContext = useSiteContext();
  const [accessToken, setAccessToken] = useState<string>("");
  const [accessTokenDecoded, setAccessTokenDecoded] = useState<object>({});
  const [viewDecodedToken, setViewDecodedToken] = useState<boolean>(false);
  const [jsonTheme, setJSONTheme] = useState<ThemeKeys>("rjv-default");
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [clipboardValue, copyToClipboard] = useCopyToClipboard();

  /** popper */
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
  });

  /** */
  const { user, getAccessTokenSilently } = useAuth0();

  /** */
  const copyHandler = () => {
    copyToClipboard(accessToken);

    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 2420);
  };

  /** JSON theme */
  useEffect(() => {
    if (SiteContext.theme === "light") {
      let theme: ThemeKeys = "rjv-default";
      setJSONTheme(theme);
    } else if (SiteContext.theme === "dark") {
      let theme: ThemeKeys = "brewer";
      setJSONTheme(theme);
    }
  }, [SiteContext.theme]);

  useEffect(() => {
    const fetchToken = async () => {
      let res = await getAccessTokenSilently();
      setAccessToken(res);

      let resDecoded: object = jwtDecode(res);
      setAccessTokenDecoded(resDecoded);
    };
    fetchToken();
  }, [user]);

  /** */
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="w-full max-w-prose">
        {/* START OF COPY AUTH TOKEN SECTION */}
        <div className="flex flex-col justify-center rounded-md bg-amber-100 p-4 dark:bg-amber-950">
          <div className="flex flex-row">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-amber-400 dark:text-amber-100"
              aria-hidden="true"
            />
            <h3 className="ml-2 text-sm font-medium text-amber-800 dark:text-amber-100">
              Caution - Auth Tokens are intended for developer use only
            </h3>
          </div>

          <div className="mt-2 text-sm text-amber-700 dark:text-amber-100">
            <ul role="list" className="list-disc space-y-1 pl-5">
              <li>
                Do not share you Auth Token with anyone - not even chrt.com
                staff.
              </li>
              <li>
                Your Auth Token rotates daily (86,400s) and provides full access
                to your account.
              </li>
              <li>
                If you are familiar with keeping an Auth Token secure, you may
                use yours with tools like Postman or the browser's Fetch API to
                make requests to our backend (on your own behalf only).
              </li>
            </ul>
          </div>

          <div className="mt-2.5 flex flex-row justify-center">
            {/* START OF AUTH TOKEN BUTTON AND POPOVER */}
            <Popover>
              <Popover.Button
                ref={setReferenceElement}
                className="focus:outline-none"
                disabled={popoverOpen}
                onClick={copyHandler}
              >
                <div
                  className={classNames(
                    "inline-flex w-56 justify-center gap-x-2 rounded-md py-3 text-sm font-semibold shadow-sm  focus:outline-none",
                    "bg-amber-400 text-amber-900 hover:bg-amber-500",
                    "text-amber-900 dark:bg-amber-300 dark:hover:bg-amber-200"
                  )}
                >
                  Copy Auth Token
                  <ClipboardDocumentIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>
              </Popover.Button>

              {popoverOpen && (
                <Popover.Panel
                  static
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  <div className="mb-1 rounded-md bg-green-200 p-2">
                    <div className="flex">
                      <div className="mx-1">
                        <p className="text-sm font-medium text-black">
                          Copied!
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <CheckCircleIcon
                          className="h-5 w-5 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              )}
            </Popover>
          </div>
        </div>
        {/* END OF COPY AUTH TOKEN SECTION */}

        {/* START OF DECODED TOKEN BUTTON */}
        <div className="mt-2 flex flex-col justify-center rounded-md bg-zinc-100 p-4 dark:bg-zinc-900">
          <div className="flex flex-row">
            <InformationCircleIcon
              className="h-5 w-5 text-zinc-400 dark:text-zinc-100"
              aria-hidden="true"
            />
            <h3 className="ml-2 text-sm font-medium text-zinc-800 dark:text-zinc-100">
              View your account's permission
            </h3>
          </div>

          <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-100">
            <ul role="list" className="list-disc space-y-1 pl-5">
              <li>
                Your decoded Auth Token (below) is not nearly as sensitive as
                the encoded version (above).
              </li>
              <li>
                The decoded token cannot be directly used to access your
                account.
              </li>
              <li>
                Still, we recommend that you only share the decoded token
                information to emails ending in '@chrt.com' for support
                purposes.
              </li>
            </ul>
          </div>

          <div className="mt-2.5 flex flex-row justify-center">
            <button
              className="mt-2 inline-flex w-56 justify-center gap-x-2 rounded-md bg-zinc-500 py-3  text-sm font-semibold text-white shadow-sm hover:bg-zinc-600 focus:outline-none dark:bg-zinc-600 dark:hover:bg-zinc-500"
              onClick={() => {
                setViewDecodedToken((state) => !state);
              }}
            >
              {!viewDecodedToken ? (
                <>
                  <div>View Decoded Token</div>
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                </>
              ) : (
                <>
                  <div>Hide Decoded Token</div>
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* START OF JSON */}
      <div className="mt-4 pb-4">
        {viewDecodedToken && (
          <ReactJson
            src={accessTokenDecoded}
            theme={jsonTheme}
            enableClipboard={false}
          />
        )}
      </div>
      {/* END OF JSON */}

      {/* START OF ERROR INVOKERS */}
      <ErrorInvokers />
      {/* END OF ERROR INVOKERS */}
    </div>
  );
}
