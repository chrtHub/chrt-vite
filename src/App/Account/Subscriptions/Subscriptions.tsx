//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import FreePreview from "./FreePreview/FreePreview";
import { useAccountContext } from "../../../Context/AccountContext";
import { CompleteUserAgreementsButton } from "./CompleteUserAgreementsButton";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Subscriptions() {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();

  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="px-3 pb-3 lg:px-0">
      {/* START OF "USER AGREEMENTS REQUIRED" COMPONENT */}
      {AccountContext.clickwrapStatusFetched &&
        !AccountContext.clickwrapIsActive && (
          <div className="flex h-32 flex-col items-center justify-center rounded-lg bg-emerald-200 dark:bg-emerald-400">
            <div className="max-w-prose">
              <p className="mb-3 text-center font-semibold text-zinc-700 dark:text-emerald-900">
                User agreements are required before previews or subscriptions
                can be accessed
              </p>
            </div>
            <CompleteUserAgreementsButton />
          </div>
        )}
      {/* END OF "USER AGREEMENTS REQUIRED" COMPONENT */}

      <FreePreview />
    </div>
  );
}
