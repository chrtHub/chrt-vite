//== react, react-router-dom, Auth0 ==//
import { useState } from "react";

//== TSX Components, Functions ==//
import InfoPagesNav from "../InfoPagesNav";
import { useAuth0 } from "@auth0/auth0-react";

//== NPM Components ==//

//== Icons ==//
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//
import { useCopyToClipboard } from "usehooks-ts";

//== Utility Functions ==//
import classNames from "../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Support() {
  //== React State, Custom Hooks ==//
  const [copyConfirm, setCopyConfirm] = useState<boolean>(false);
  const [clipboardValue, copyToClipboard] = useCopyToClipboard();
  const { user } = useAuth0();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  const copyHandler = async (contentToCopy: string) => {
    copyToClipboard(contentToCopy);

    setCopyConfirm(true);
    setTimeout(() => {
      setCopyConfirm(false);
    }, 500);
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      {/* <InfoPagesNav /> */}
      <div className="isolate">
        <div className="mx-auto mt-6 space-y-16">
          {/* Technical Support */}
          <div className="flex gap-x-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
              <ComputerDesktopIcon
                className="h-8 w-8 text-white"
                aria-hidden="true"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
                Technical support
              </h3>
              <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">
                You can reach us by email at support@chrt.com
              </p>
            </div>

            {/* Start of Email Buttons */}
            <div className="col-span-3 flex w-80 flex-col gap-2 lg:col-span-2">
              <button
                type="button"
                onClick={() => {
                  copyHandler("support@chrt.com");
                }}
                className={classNames(
                  "flex flex-row items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ",
                  copyConfirm
                    ? "animate-pulse bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200"
                    : "bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-100 dark:bg-fuchsia-900 dark:text-fuchsia-100 dark:hover:bg-fuchsia-800"
                )}
              >
                support@chrt.com
                <ClipboardDocumentIcon
                  className="ml-2 h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <a
                href={`mailto:support@chrt.com?subject=${encodeURIComponent(
                  `Support request from user ${user?.email} - topic: ...`
                )}`}
                className="rounded-md bg-fuchsia-100 px-2.5 py-1.5 text-center text-sm font-semibold text-fuchsia-600 shadow-sm hover:bg-fuchsia-100 dark:bg-fuchsia-900 dark:text-fuchsia-100 dark:hover:bg-fuchsia-800"
              >
                Open "Support Request" Email Draft
              </a>
            </div>
            {/* End of Email Buttons */}
          </div>
          {/* End of Technical Support */}
        </div>
      </div>
    </>
  );
}
