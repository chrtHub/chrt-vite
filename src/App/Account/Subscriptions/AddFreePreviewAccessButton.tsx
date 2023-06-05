//== react, react-router-dom, recoil, Auth0 ==//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";

//== NPM Components ==//
import { CheckIcon } from "@heroicons/react/20/solid";
import { NavLink } from "react-router-dom";

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
  const { getAccessTokenSilently, user } = useAuth0();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  const addFreePreviewAccessHandler = async () => {
    AccountContext.setFreePreviewAccessChanging(true);
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

      //-- Update listed permissions --//
      try {
        getUsersPermissions(accessToken, AccountContext);
      } catch (err) {
        if (err instanceof AxiosError) {
          axiosErrorToaster(err, "Get roles and permissions");
        } else if (err instanceof Error) {
          toast(err.message);
        }
      }

      //----//
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "");
      } else if (err instanceof Error) {
        toast(err.message);
      }
    }
    AccountContext.setFreePreviewAccessChanging(false);
  };

  //-- Track if ROLE_NAME is active --//
  //   const [roleActive, setRoleActive] = useState<boolean>(
  //     isRoleActive(ROLE_NAME, AccountContext)
  //   );
  //   useEffect(() => {
  //     setRoleActive(isRoleActive(ROLE_NAME, AccountContext));
  //   }, [AccountContext.roles]);

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      <button
        type="button"
        disabled={false} // TODO
        onClick={addFreePreviewAccessHandler}
        className={classNames(
          "tex-stm mt-4 w-64 items-center gap-x-2 rounded-md px-3.5 py-2.5 text-center font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "animate-pulse bg-zinc-200 text-zinc-500"
        )}
      >
        <div className="flex flex-row items-center justify-center">
          <p className="mr-2 text-sm">Loading...</p>
        </div>
      </button>

      {/* OLD */}
      <button
        type="button"
        disabled={isRoleActive(ROLE_NAME, AccountContext)}
        onClick={addFreePreviewAccessHandler}
        className={classNames(
          "tex-stm mt-4 w-64 items-center gap-x-2 rounded-md px-3.5 py-2.5 text-center font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          !AccountContext.rolesFetched
            ? // true
              "animate-pulse bg-zinc-200 text-zinc-500"
            : AccountContext.freePreviewAccessChanging
            ? "animate-pulse bg-zinc-200 text-zinc-900"
            : isRoleActive(ROLE_NAME, AccountContext)
            ? "cursor-not-allowed bg-green-800 text-white"
            : !isRoleActive(ROLE_NAME, AccountContext)
            ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
            : ""
        )}
      >
        {/* {true ? ( */}
        {!AccountContext.rolesFetched ? (
          <div className="flex flex-row items-center justify-center">
            <p className="mr-2 text-sm">Loading...</p>
          </div>
        ) : AccountContext.freePreviewAccessChanging ? (
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
    </>
  );
}
