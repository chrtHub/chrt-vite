//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
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
import { RoleWithPermissions } from "../../Auth/Auth0";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Profile() {
  //-- State, Context, Custom Hooks --//
  const [rolesWithPermissionsList, setRolesWithPermissionsList] = useState<
    RoleWithPermissions[]
  >([]);
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  //-- Other --//

  //-- Side Effects --//
  useEffect(() => {
    getUsersPermissions();
  }, []);

  const getUsersPermissions = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      let res = await axios.get(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/get_user_roles_with_permissions`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data: RoleWithPermissions[] = res.data;
      setRolesWithPermissionsList(data);
      //----//
    } catch (err) {
      // console.log(err) // DEV
      // showBoundary(err) // DEV
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Get roles and permissions");
      }
    }
  };

  //-- Handlers --//
  const addFreePreviewAccessHandler = () => {
    console.log("todo - add free preview access");
  };

  const removeFreePreviewAccesshandler = () => {
    console.log("todo - remove free preview access");
  };

  console.log(rolesWithPermissionsList); // DEV

  return (
    <>
      <Auth0Profile />
      <div className="flex flex-col gap-2">
        <div>
          {rolesWithPermissionsList.map((role, idx) => (
            <div key={idx} style={{ marginBottom: "20px" }}>
              <h2>Role: {role.role_name}</h2>
              <p>Description: {role.role_description}</p>
              <h3>Permissions:</h3>
              <ul>
                {role.permissions.map((permission, jdx) => (
                  <li key={jdx}>{permission}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button
          onClick={addFreePreviewAccessHandler}
          className="rounded-full bg-blue-500"
        >
          Add Free Preview Access
        </button>
        <br />
        <button
          onClick={removeFreePreviewAccesshandler}
          className="rounded-full bg-blue-500"
        >
          Cancel Free Preview Access
        </button>
      </div>
    </>
  );
}
