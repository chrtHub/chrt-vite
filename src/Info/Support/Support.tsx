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

  //-- Email contents --//
  const supportRequestSubject = encodeURIComponent(
    `Support request from user ${user?.email} - topic: ...`
  );

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-zinc-200 p-3 dark:bg-zinc-800">
      {/* START OF LHS/TOP */}
      <div className="col-span-2 flex flex-row items-center justify-start lg:col-span-1">
        {/* Icon */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <ComputerDesktopIcon
            className="h-8 w-8 text-white"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex flex-col items-center justify-start">
          {/* Header, subheader */}
          <div>
            <h3 className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
              Technical support
            </h3>
            <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">
              You can reach us by email
            </p>
          </div>
        </div>
      </div>
      {/* END OF LHS/TOP */}

      {/* RHS/BOTTOM */}
      <div className="col-span-2 lg:col-span-1">
        {/* Start of Email Buttons */}
        <div className="col-span-3 flex w-80 max-w-full flex-col gap-2 lg:col-span-2">
          {/* Copy Email Text */}
          <h2 className="border-b border-zinc-400 pb-1 text-sm font-semibold text-zinc-900 dark:border-zinc-400 dark:text-zinc-100">
            Copy Email
          </h2>
          <button
            type="button"
            onClick={() => {
              copyHandler("support@chrt.com");
            }}
            className={classNames(
              "flex flex-row items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ",
              copyConfirm
                ? "animate-pulse bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200"
                : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800"
            )}
          >
            support@chrt.com
            <ClipboardDocumentIcon
              className="ml-2 h-6 w-6"
              aria-hidden="true"
            />
          </button>
          {/* Email Draft Text */}
          <h2 className="border-b border-zinc-400 py-1 text-sm font-semibold text-zinc-900 dark:border-zinc-400 dark:text-zinc-100">
            Open "Support Request" Email Draft
          </h2>
          {/* Gmail Button */}
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
              "support@chrt.com"
            )}&su=${supportRequestSubject}`}
            className="rounded-md bg-indigo-100 px-2.5 py-1.5 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800"
          >
            Gmail (in browser)
          </a>

          {/* Default email client button */}
          <a
            href={`mailto:support@chrt.com?subject=${supportRequestSubject}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-indigo-100 px-2.5 py-1.5 text-center text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800"
          >
            Default Email Client
          </a>
        </div>
        {/* End of Email Buttons */}
      </div>
      {/* END OF RHS/BOTTOM */}
    </div>
  );
}
