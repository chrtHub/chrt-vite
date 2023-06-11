import axios from "axios";
import { ROLE_ROUTES } from "./ROLE_ROUTES";
import { getClickwrapUserStatus } from "../../DataPrivacy/Clickwrap/Util/getClickwrapUserStatus";

import { IAccountContext } from "../../../../Context/AccountContext";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

export default async function addRole(
  accessToken: string,
  AccountContext: IAccountContext,
  role_name: string
) {
  const role_route = ROLE_ROUTES.find((route) => route.name === role_name);

  try {
    //-- Before assigning a role, check that clickwrap status is active --//
    await getClickwrapUserStatus(accessToken, AccountContext);

    if (AccountContext.clickwrapActive) {
      //-- Make POST request --//
      await axios.post(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/assign_roles_to_user/${role_route}`,
        //-- Body Content --//
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } else {
      throw new Error(); // DEV
    }
  } catch (err) {
    throw err;
  }
}
