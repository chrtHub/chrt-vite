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
export default function Agreements() {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();

  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="max-w-sm rounded-lg bg-zinc-200">
      <p>
        {AccountContext.clickwrapAgreements.map((agreement) => {
          return <p>{agreement.name}</p>;
        })}
      </p>
      <ShieldCheckIcon className="h-12 w-12 text-green-600" />
      <WithdrawConsentButtonAndModal />
    </div>
  );
}
