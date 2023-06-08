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

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import classNames from "../../../Util/classNames";
import { isRoleActive } from "./isRoleActive";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

const ROLE_NAME = "Free Preview Access";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function AddFreePreviewAccessButton() {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();
  const { getAccessTokenSilently } = useAuth0();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  const addFreePreviewAccessHandler = async () => {
    AccountContext.setAddingFreePreviewAccess(true);
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      await axios.post(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/assign_roles_to_user/free_preview_access`,
        //-- Body Content --//
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //-- Force a fetch of the new auth token with added permissions from Auth0 --//
      accessToken = await getAccessTokenSilently({ cacheMode: "off" });

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

      //----//
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Add subscription");
      } else if (err instanceof Error) {
        toast(err.message);
      }
    }
    AccountContext.setAddingFreePreviewAccess(false);
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <button
      type="button"
      disabled={isRoleActive(ROLE_NAME, AccountContext)}
      onClick={addFreePreviewAccessHandler}
      className={classNames(
        "tex-stm mt-4 w-64 items-center gap-x-2 rounded-md px-3.5 py-2.5 text-center font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        !AccountContext.rolesFetched
          ? "animate-pulse bg-zinc-200 text-zinc-500"
          : AccountContext.addingFreePreviewAccess ||
            AccountContext.removingFreePreviewAccess
          ? "animate-pulse cursor-not-allowed bg-zinc-200 text-zinc-900"
          : isRoleActive(ROLE_NAME, AccountContext)
          ? "cursor-not-allowed bg-green-800 text-white"
          : !isRoleActive(ROLE_NAME, AccountContext)
          ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
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
      ) : isRoleActive(ROLE_NAME, AccountContext) ? (
        <div className="flex flex-row items-center justify-center">
          <p className="mr-2 text-sm">{ROLE_NAME} Active</p>
          <CheckCircleIcon className="h-5 w-5" />
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center">
          <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
          <p className="ml-2 text-sm">Add {ROLE_NAME}</p>
        </div>
      )}
    </button>
  );
}
