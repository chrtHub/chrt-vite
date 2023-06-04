//-- react, react-router-dom, Auth0 --//
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//-- TSX Components and Functions --//
import Auth0Profile from "../../Auth/Auth0Profile";
import { axiosErrorToaster } from "../../Errors/axiosErrorToaster";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios, { AxiosError } from "axios";

//-- Utility Functions --//

//-- Data Objects, Types --//
import { Permission } from "../../Auth/Auth0";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Profile() {
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  const getUsersPermissions = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      let res = await axios.get(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/get_user_permissions`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const permissions: Permission[] = res.data;
      // turn res.data into list of roles with permissions
      // TODO
      //----//
    } catch (err) {
      // console.log(err)
      // showBoundary(err)
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "");
      }
    }
  };

  useEffect(() => {
    getUsersPermissions();
  }, []);

  return (
    <>
      <Auth0Profile />
      <div>
        <p>TODO - list user's roles and permissions</p>
        <button
          onClick={() => {
            console.log("todo - add free preview access");
          }}
        >
          Add Free Preview Access
        </button>
        <button
          onClick={() => {
            console.log("todo - cancel free preview access");
          }}
        >
          Cancel Free Preview Access
        </button>
      </div>
    </>
  );
}
