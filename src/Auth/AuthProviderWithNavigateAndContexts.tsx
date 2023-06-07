//-- react, react-router-dom, Auth0 --//
import { ReactNode } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Auth0Provider, AppState, User } from "@auth0/auth0-react";
import { SiteContextProvider } from "../Context/SiteContext";
import { AccountContextProvider } from "../Context/AccountContext";
import { JournalContextProvider } from "../Context/JournalContext";
import { ChatContextProvider } from "../Context/ChatContext";

//-- TSX Components --//
import { useIsMobile } from "../Util/useUserAgent";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AuthProviderWithNavigateAndContexts() {
  const navigate = useNavigate();
  let mobile = useIsMobile();

  //-- If user requested a Guarded Route, but was sent to login, then upon redirect to this SPA, the Guarded Route's path that the user tried to access is returned by the server as the value appState.returnTo --//
  const onRedirectCallback = (appState?: AppState, user?: User) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  //-- ContextsProvider as nested Contexts Providers --//
  interface IContextsProviderProps {
    children: ReactNode;
  }
  const ContextsProvider = ({ children }: IContextsProviderProps) => {
    return (
      <SiteContextProvider>
        <AccountContextProvider>
          <JournalContextProvider>
            <ChatContextProvider>
              {children}
              {/*----*/}
            </ChatContextProvider>
          </JournalContextProvider>
        </AccountContextProvider>
      </SiteContextProvider>
    );
  };

  return (
    <Auth0Provider
      domain="chrt-prod.us.auth0.com" //-- Tenant: 'chrt-prod' --//
      clientId="8bDLHYeEUfPHH81VRDBsCTN5TYklAMCu" //-- Application: 'chrt-prod-app' --//
      cacheLocation={mobile ? "localstorage" : "memory"}
      authorizationParams={{
        redirect_uri: `${window.location.origin}`, //-- redirect_uri NOTE - localhost not allowed by Auth0 for prod tenant (which is 'chrt-prod') --//
        audience: "https://chrt.com", //-- API: 'chrt' (also /userinfo by default) --//
        scope:
          "openid profile email read:journal write:journal read:data chat:llm",
        //-- Scope guide:
        //-- 'openid' included by default, indicates app will use OIDC --//
        //-- 'profile' allows name and profile photo --//
        //-- 'email' allows email --//
        //-- 'read:journal' and other custom API claims will get included in the access token's 'scope' and 'permissions' only if the user has those permissions granted either directly or via a role --//
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <ContextsProvider>
        <Outlet />
      </ContextsProvider>
    </Auth0Provider>
  );
}
