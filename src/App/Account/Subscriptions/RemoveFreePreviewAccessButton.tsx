//== react, react-router-dom, Auth0 ==//
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

//== Utility Functions ==//
import { getUsersPermissions } from "../getUserPermissions";
import { isRoleActive } from "./isRoleActive";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { MinusCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import classNames from "../../../Util/classNames";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

const ROLE_NAME = "Free Preview Access";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function RemoveFreePreviewAccessButton({
  setModalOpen,
}: IProps) {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();
  const { getAccessTokenSilently, user } = useAuth0();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  const removeFreePreviewAccesshandler = async () => {
    AccountContext.setRemovingFreePreviewAccess(true);
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make DELETE request --//
      await axios.delete(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/remove_roles_from_user/free_preview_access`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //-- Update listed permissions --//
      try {
        await getUsersPermissions(accessToken, AccountContext);
      } catch (err) {
        if (err instanceof AxiosError) {
          axiosErrorToaster(err, "Get subscriptions");
        } else if (err instanceof Error) {
          toast(err.message);
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Remove subscription");
      } else if (err instanceof Error) {
        toast(err.message);
      }
    }
    AccountContext.setRemovingFreePreviewAccess(false);
    setModalOpen(false);
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <button
      type="button"
      disabled={!isRoleActive(ROLE_NAME, AccountContext)}
      onClick={removeFreePreviewAccesshandler}
      className={classNames(
        "tex-stm w-full items-center gap-x-2 rounded-md px-3.5 py-2.5 text-center font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:w-64",
        !AccountContext.rolesFetched
          ? "animate-pulse bg-zinc-200 text-zinc-500"
          : AccountContext.addingFreePreviewAccess ||
            AccountContext.removingFreePreviewAccess
          ? "animate-pulse cursor-not-allowed bg-zinc-200 text-zinc-900"
          : !isRoleActive(ROLE_NAME, AccountContext)
          ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
          : isRoleActive(ROLE_NAME, AccountContext)
          ? "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600"
          : ""
      )}
    >
      {!AccountContext.rolesFetched ? (
        <div className="flex flex-row items-center justify-center">
          <p className="mr-2 text-sm">Loading...</p>
        </div>
      ) : AccountContext.addingFreePreviewAccess ||
        AccountContext.removingFreePreviewAccess ? (
        <div className="flex flex-row items-center justify-center">
          <p className="mr-2 text-sm">Updating...</p>
        </div>
      ) : !isRoleActive(ROLE_NAME, AccountContext) ? (
        <div className="flex flex-row items-center justify-center">
          <p className="mr-2 text-sm">{ROLE_NAME} inactive</p>
          <XCircleIcon className="h-5 w-5" />
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center">
          <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
          <p className="ml-2 text-sm">Remove {ROLE_NAME}</p>
        </div>
      )}
    </button>
  );
}
