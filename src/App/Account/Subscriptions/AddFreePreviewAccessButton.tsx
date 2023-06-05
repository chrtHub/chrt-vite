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
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import classNames from "../../../Util/classNames";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

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
      //----//
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "");
      } else if (err instanceof Error) {
        toast(err.message);
      }
    }
    //-- Update listed permissions --//
    let accessToken = await getAccessTokenSilently();
    try {
      getUsersPermissions(accessToken, AccountContext);
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Get roles and permissions");
      }
    }
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <button
      type="button"
      onClick={addFreePreviewAccessHandler}
      className={classNames(
        "inline-flex w-64 items-center gap-x-2 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      )}
    >
      <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      Add Free Preview Access
    </button>
  );
}
