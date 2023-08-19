//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";
import ClickwrapWithFallback from "./Clickwrap/ClickwrapWithFallback";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function DataPrivacy() {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();
  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="pb-3">
      {/* START OF "CHOOSE A SUBSCRIPTION" */}
      {AccountContext.clickwrapIsActive && (
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-emerald-200 px-3 py-3 dark:bg-emerald-400">
          <div className="max-w-md">
            <p className="text-center font-semibold text-zinc-700 dark:text-emerald-900">
              All user agreements are active
            </p>
            <button>choose a subscription</button>
          </div>
        </div>
      )}
      {/* END OF "CHOOSE A SUBSCRIPTION" */}
      {/* START OF "USER AGREEMENTS REQUIRED" COMPONENT */}
      {AccountContext.clickwrapStatusFetched &&
        !AccountContext.clickwrapIsActive && (
          <div className="flex w-full flex-col items-center justify-center rounded-lg bg-emerald-200 px-3 py-3 dark:bg-emerald-400">
            <div className="max-w-md">
              <p className="text-center font-semibold text-zinc-700 dark:text-emerald-900">
                The user agreements below are required before previews or
                subscriptions can be accessed
              </p>
            </div>
          </div>
        )}
      {/* END OF "USER AGREEMENTS REQUIRED" COMPONENT */}
      <div className="mt-3">
        <ClickwrapWithFallback />
      </div>
    </div>
  );
}
