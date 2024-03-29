import { RoleWithPermissions } from "../../../../Auth/Auth0";
import { IAccountContext } from "../../../../Context/AccountContext";
import axios from "axios";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

export const getUserPermissions = async (
  accessToken: string,
  AccountContext: IAccountContext
) => {
  try {
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
    AccountContext.setRoles(data);
    AccountContext.setRolesFetched(true);
    //----//
  } catch (err) {
    throw err;
  }
};
