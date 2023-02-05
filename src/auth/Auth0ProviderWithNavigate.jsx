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
      domain="chrt-prod.us.auth0.com" //-- Tenant: 'chrt-prod' --//
      clientId="8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu" //-- Application: 'chrt-prod-app' --//
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`, //-- NOTE - localhost not allowed by Auth0 for prod tenant (which is 'chrt-prod') --//
        audience: "https://chrt.com", //-- API: 'chrt' (also /userinfo by default) --//
        scope: "openid read:journal write:journal read:data",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Outlet />
    </Auth0Provider>
  );
}
