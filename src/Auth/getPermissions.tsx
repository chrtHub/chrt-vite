import { useAuth0 } from "@auth0/auth0-react";

import jwtDecode from "jwt-decode";
import { JwtPayload } from "jwt-decode";

//-- Start of: Adapted from Express server code, 2023-05-28 --//
//-- Strangely, the Auth0 types for JwtPayload don't cover the properties returned within tokens, so this interface extends JwtPayload --//
interface IExtendedJwtPayload extends JwtPayload {
  azp?: string;
  scope?: string;
  permissions?: string[] | string;
  app_metadata?: {
    user_db_id?: string;
    // [key: string]: any; //-- Index-signature syntax, perhaps use in the future if more app_metadat fields added --//
  };
}
//-- End of: Adapted from Express server code, 2023-05-28 --//

export const getPermissions = async (): Promise<string[]> => {
  // export const getPermissions = (accessToken: string): string[] => {
  const { getAccessTokenSilently } = useAuth0();
  let accessToken = await getAccessTokenSilently();
  const decodedToken: IExtendedJwtPayload = jwtDecode(accessToken);
  const permissions = decodedToken.permissions;
  if (permissions) {
    return Array.isArray(permissions) ? permissions : [permissions];
  } else {
    return [];
  }
};
