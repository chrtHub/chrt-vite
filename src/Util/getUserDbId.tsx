import jwtDecode from "jwt-decode";
import { JwtPayload } from "jwt-decode";

//-- Strangely, the Auth0 types for JwtPayload don't cover the properties returned within tokens, so this interface extends JwtPayload --//
export interface IExtendedJwtPayload extends JwtPayload {
  azp?: string;
  scope?: string;
  permissions?: string[] | string;
  app_metadata?: {
    user_db_id?: string;
    // [key: string]: any; //-- Index-signature syntax, perhaps use in the future if more app_metadat fields added --//
  };
}

//-- Example decoded JwtPayload: --//
// {
//   "iss": "https://chrt-prod.us.auth0.com/",
//   "sub": "google-oauth2|***redacted_number***",
//   "aud": [
//     "https://chrt.com",
//     "https://chrt-prod.us.auth0.com/userinfo"
//   ],
//   "iat": 1678231341,
//   "exp": 1678317741,
//   "azp": "8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu",
//   "scope": "openid profile email read:journal write:journal read:data",
//   "permissions": [
//     "read:data",
//     "read:journal",
//     "write:journal"
//   ]
// }

/**
 * Decode an access token and get the user_db_id value
 *
 * @param access_token
 * @returns user_db_id
 */
export function getUserDbId(access_token: string) {
  let access_token_decoded: IExtendedJwtPayload = jwtDecode(access_token);
  let user_db_id =
    access_token_decoded?.app_metadata?.user_db_id ??
    access_token_decoded?.sub ??
    "";

  return user_db_id;
}
