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
import { MinusCircleIcon } from "@heroicons/react/24/solid";
import classNames from "../../../Util/classNames";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function RemoveFreePreviewAccessButton() {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();
  const { getAccessTokenSilently, user } = useAuth0();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  const removeFreePreviewAccesshandler = async () => {
    console.log("todo - remove free preview access"); // DEV
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      let res = await axios.delete(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/remove_roles_from_user/free_preview_access`,
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
      onClick={removeFreePreviewAccesshandler}
      className={classNames(
        "inline-flex w-64 items-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      )}
    >
      <MinusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      Remove Free Preview Access
    </button>
  );
}
