import axios from "axios";
import { IAccountContext } from "../../../../Context/AccountContext";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

const ROLE_ROUTES = [
  {
    name: "Free Preview Access",
    route: "free_preview_access",
  },
];

export default async function addRole(
  accessToken: string,
  AccountContext: IAccountContext,
  role_name: string
) {
  const role_route = ROLE_ROUTES.find((route) => route.name === role_name);

  try {
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
  } catch (err) {
    throw err;
  }
}
