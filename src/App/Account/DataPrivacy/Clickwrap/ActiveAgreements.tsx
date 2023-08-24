//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useAccountContext } from "../../../../Context/AccountContext";
import WithdrawConsentButtonAndModal from "./WithdrawConsentButtonAndModal";

//== NPM Components ==//

//== Icons ==//
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ActiveAgreements() {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();

  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="w-full rounded-lg bg-zinc-200 px-5 py-5 dark:bg-zinc-700">
      {/* User Agreements Title */}
      <h2 className="mb-2 flex w-full items-center justify-center font-semibold text-zinc-700 dark:text-zinc-300">
        User Agreements
      </h2>

      {/* START OF AGREEMENTS */}
      <div>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {AccountContext.clickwrapAgreements.map((agreement) => (
            <li
              key={agreement.name}
              className="col-span-1 flex rounded-md shadow-sm"
            >
              <div
                className={classNames(
                  "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-zinc-300 text-sm font-medium text-white dark:bg-zinc-600"
                )}
              >
                <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-zinc-200 bg-white dark:border-none dark:bg-zinc-800">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <p className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-50">
                    {agreement.name}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* END OF AGREEMENTS */}

      {/* WITHDRAW CONSENT BUTTON AND MODAL */}
      <div className="mt-5 flex flex-row items-center justify-center">
        <WithdrawConsentButtonAndModal />
      </div>
    </div>
  );
}
