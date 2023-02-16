import jwt_decode from "jwt-decode";

export default function getUserDbId(accessToken) {
  let decodedAccessToken = jwt_decode(accessToken);
  let user_db_id =
    decodedAccessToken?.app_metatdata?.user_db_id || decodedAccessToken.sub;
  return user_db_id;
}
