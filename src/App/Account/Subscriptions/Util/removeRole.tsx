import axios from "axios";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

export default async function removeRole(
  accessToken: string,
  role_route: string
) {
  try {
    //-- Make DELETE request --//
    await axios.delete(
      `${VITE_ALB_BASE_URL}/auth0/api/v2/remove_roles_from_user/${role_route}`,
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
