//== react, react-router-dom, Auth0 ==//
import { useNavigate } from "react-router-dom";

//== TSX Components, Functions ==//
import FreePreview from "./FreePreview/FreePreview";
import { useAccountContext } from "../../../Context/AccountContext";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Subscriptions() {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();
  const navigate = useNavigate();

  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="px-3 pb-3 lg:px-0">
      {!AccountContext.clickwrapIsActive && (
        <div className="flex h-32 flex-col items-center justify-center rounded-lg bg-zinc-200">
          <div className="max-w-prose">
            <p className="font-semibold text-zinc-700">
              User agreements are required before previews or subscriptions can
              be accessed
            </p>
          </div>
          <button
            onClick={() => navigate("/account/data_privacy")}
            className="mt-3 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Complete user agreements <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
      <FreePreview />
    </div>
  );
}
