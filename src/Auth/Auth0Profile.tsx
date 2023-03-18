//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

//-- TSX Components --//

//-- NPM Components --//
import { Popover } from "@headlessui/react";

//-- Icons --//
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

//-- NPM Functions --//
import { useCopyToClipboard } from "usehooks-ts";
import { usePopper } from "react-popper";

//-- Utility Functions --//
import classNames from "../Util/classNames";

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
const Profile = () => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [clipboardValue, copyToClipboard] = useCopyToClipboard();

  /** popper */
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
  });

  const { user, getAccessTokenSilently } = useAuth0();

  const copyHandler = () => {
    copyToClipboard(accessToken);

    setPopoverOpen(true);
    setTimeout(() => {
      console.log("interval");
      setPopoverOpen(false);
    }, 2420);
  };

  useEffect(() => {
    const fetchToken = async () => {
      let res = await getAccessTokenSilently();
      setAccessToken(res);
    };
    fetchToken();
  }, [user]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img
        src={user?.picture}
        alt={user?.name}
        className="h-24 w-24 rounded-full"
      />
      <h2 className="mt-4 text-2xl font-medium text-black dark:text-white">
        {user?.name}
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400">{user?.email}</p>

      <Popover>
        <Popover.Button
          ref={setReferenceElement}
          className="focus:outline-none"
        >
          <button
            disabled={popoverOpen}
            type="button"
            className={classNames(
              "mt-4 mb-1  inline-flex items-center gap-x-2 rounded-md bg-green-500 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus:outline-none dark:bg-green-800 dark:hover:bg-green-700"
            )}
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
    </div>
  );
};

export default Profile;
