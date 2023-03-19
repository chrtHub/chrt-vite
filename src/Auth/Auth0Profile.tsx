//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

//-- TSX Components --//

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
import classNames from "../Util/classNames";

//-- Data Objects --//
import { echartsThemeState } from "../Layout/atoms";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
const Profile = () => {
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

  const { user, getAccessTokenSilently } = useAuth0();

  const copyHandler = () => {
    copyToClipboard(accessToken);

    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 2420);
  };

  /** JSON theme */
  const echartsTheme = useRecoilValue(echartsThemeState);
  useEffect(() => {
    if (echartsTheme === "light") {
      let theme: ThemeKeys = "rjv-default";
      setJSONTheme(theme);
    } else if (echartsTheme === "dark") {
      let theme: ThemeKeys = "brewer";
      setJSONTheme(theme);
    }
  }, [echartsTheme]);

  useEffect(() => {
    const fetchToken = async () => {
      let res = await getAccessTokenSilently();
      setAccessToken(res);

      let resDecoded: object = jwtDecode(res);
      setAccessTokenDecoded(resDecoded);
    };
    fetchToken();
  }, [user]);

  return (
    <div className="flex h-screen flex-col items-center justify-start">
      <img
        src={user?.picture}
        alt={user?.name}
        className="h-24 w-24 rounded-full"
      />
      <h2 className="mt-4 text-2xl font-medium text-black dark:text-white">
        {user?.name}
      </h2>
      <p className="mb-2 text-zinc-500 dark:text-zinc-400">{user?.email}</p>
      <Popover>
        <Popover.Button
          ref={setReferenceElement}
          className="focus:outline-none"
        >
          <button
            disabled={popoverOpen}
            type="button"
            className="mt-2 mb-1 inline-flex w-56 justify-center  gap-x-2 rounded-md bg-green-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus:outline-none dark:bg-green-800 dark:hover:bg-green-700"
            onClick={copyHandler}
          >
            Copy Auth Token
            <ClipboardDocumentIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </Popover.Button>

        {popoverOpen && (
          <Popover.Panel
            static
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className="rounded-md bg-green-200 p-2">
              <div className="flex">
                <div className="mx-1">
                  <p className="text-sm font-medium text-green-800">Copied!</p>
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
      <div className="mt-4 pb-4">
        {viewDecodedToken && (
          <ReactJson
            src={accessTokenDecoded}
            theme={jsonTheme}
            enableClipboard={false}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
