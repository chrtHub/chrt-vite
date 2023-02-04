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
export default function Auth0ProviderWithNavigate() {
  const navigate = useNavigate();

  //-- If user requested Guarded Route but was sent to login, the Guarded Route path is returned as appState.returnTo --//
  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain="dev-u4trvdw25pkfbgaq.us.auth0.com"
      clientId="nJH6eXO0snTYdLQ2W9Zm6JndVwD4ActU" //-- Application: chrt-vite --//
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: "https://chrt.com", //-- chrt API, also includes '/userinfo' by default  --//
        // scope: "read:journal write:journal read:data",

        // audience: "https://dev-u4trvdw25pkfbgaq.us.auth0.com/api/v2/", //-- Auth0 Management API --//

        //-- If no scope, default are the OpenID Connect scopes: openid profile email --//
        // scope: "read:current_user update:current_user_metadata",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Outlet />
    </Auth0Provider>
  );
}
