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
    <div className="max-w-sm rounded-lg bg-zinc-200">
      {/* START OF AGREEMENTS */}
      <div>
        {AccountContext.clickwrapAgreements.map((agreement) => {
          return <p key={agreement.name}>{agreement.name}</p>;
        })}
      </div>
      <ShieldCheckIcon className="h-12 w-12 text-green-600" />
      {/* END OF AGREEMENTS */}

      {/* WITHDRAW CONSENT BUTTON AND MODAL */}
      <WithdrawConsentButtonAndModal />
    </div>
  );
}
