//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//
import { isRoleActive } from "./isRoleActive";
//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  setRemoveFreePreviewAccessModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}
export default function CancelFreePreviewAccessButton({
  setRemoveFreePreviewAccessModalOpen,
}: IProps) {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      {isRoleActive("Free Preview Access", AccountContext) && (
        <button
          type="button"
          onClick={() => setRemoveFreePreviewAccessModalOpen(true)}
          className="mt-6 w-16 rounded-full bg-red-50 px-1 py-0.5 text-xs font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-100 dark:bg-red-900 dark:text-red-100 dark:ring-red-900 dark:hover:bg-red-800"
        >
          Cancel
        </button>
      )}
    </>
  );
}
