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

/**
 *
 * @param accessToken
 * @returns
 */
export const getPermissions = async (accessToken: string) => {
  // export const getPermissions = (accessToken: string): string[] => {

  const decodedToken: IExtendedJwtPayload = jwtDecode(accessToken);
  const permissions = decodedToken.permissions;
  if (permissions) {
    return Array.isArray(permissions) ? permissions : [permissions];
  } else {
    return [];
  }
};
