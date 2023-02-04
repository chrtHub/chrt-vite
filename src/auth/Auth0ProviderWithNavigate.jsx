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
      //-- domain + clientID are for Tenant: chrt-prod, App: chrt-prod-app --//
      domain="chrt-prod.us.auth0.com"
      clientId="8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu"
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: "https://chrt.com", //-- chrt API, also includes '/userinfo' by default  --//
        scope: "read:journal write:journal read:data",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Outlet />
    </Auth0Provider>
  );
}
