//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useAccountContext } from "../../../../Context/AccountContext";
import WithdrawConsentButtonAndModal from "./WithdrawConsentButtonAndModal";
//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

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
    <div className="max-w-sm rounded-lg bg-zinc-200 py-3 dark:bg-zinc-700">
      {/* User Agreeements Title */}
      <h2 className="mb-2 flex w-full items-center justify-center font-semibold text-zinc-600 dark:text-zinc-300">
        User Agreements
      </h2>
      {/* START OF AGREEMENTS */}
      <div className="pb-3">
        {AccountContext.clickwrapAgreements.map((agreement) => {
          return (
            <div className="flex flex-row items-center justify-start gap-3 px-3 py-1">
              <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-500" />
              <p
                className="text-zinc-900 dark:text-zinc-50"
                key={agreement.name}
              >
                {agreement.name}
              </p>
            </div>
          );
        })}
      </div>
      {/* END OF AGREEMENTS */}

      {/* WITHDRAW CONSENT BUTTON AND MODAL */}
      <div className="flex flex-row items-center justify-center">
        <WithdrawConsentButtonAndModal />
      </div>
    </div>
  );
}
