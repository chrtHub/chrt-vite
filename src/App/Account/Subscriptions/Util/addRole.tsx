import axios from "axios";
import { getUserClickwrapData } from "../../DataPrivacy/Clickwrap/Util/getUserClickwrapData";

import { IAccountContext } from "../../../../Context/AccountContext";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

export default async function addRole(
  accessToken: string,
  AccountContext: IAccountContext,
  role_route: string
) {
  try {
    //-- Before assigning a role, check that clickwrap status is active --//
    await getUserClickwrapData(accessToken, AccountContext);

    if (AccountContext.clickwrapIsActive) {
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
