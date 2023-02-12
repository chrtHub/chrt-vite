//-- react, react-router-dom, Auth0 --//
import { Outlet, useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AuthProviderWithNavigate() {
  const navigate = useNavigate();

  //-- If user requested a Guarded Route, but was sent to login, then upon redirect to this SPA, the Guarded Route's path that the user tried to access is returned by the server as the value appState.returnTo --//
  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain="chrt-prod.us.auth0.com" //-- Tenant: 'chrt-prod' --//
      clientId="8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu" //-- Application: 'chrt-prod-app' --//
      authorizationParams={{
        redirect_uri: `${window.location.origin}`, //-- redirect_uri NOTE - localhost not allowed by Auth0 for prod tenant (which is 'chrt-prod') --//
        audience: "https://chrt.com", //-- API: 'chrt' (also /userinfo by default) --//
        scope: "openid profile email read:journal write:journal read:data",
        //-- Scope guide:
        //-- 'openid' included by default, indicates app will use OIDC --//
        //-- 'profile' allows name and profile photo --//
        //-- 'email' allows email --//
        //-- 'read:journal' and other custom API claims will get included in the access token's 'scope' and 'permissions' only if the user has those permissions granted either directly or via a role --//
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Outlet />
    </Auth0Provider>
  );
}
