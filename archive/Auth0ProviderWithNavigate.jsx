import { Auth0Provider } from "@auth0/auth0-react";

export const Auth0ProviderWithNavigate = ({ children }) => {
  return (
    <Auth0Provider
      domain="dev-u4trvdw25pkfbgaq.us.auth0.com"
      clientId="nJH6eXO0snTYdLQ2W9Zm6JndVwD4ActU" //-- Application: chrt-vite --//
      authorizationParams={{
        redirect_uri: window.location.origin,
        // audience:
        // "https://dev-u4trvdw25pkfbgaq.us.auth0.com/api/v2/", //-- Auth0 Management API --//
        // // "TODO"//-- chrt API --//
        // scope: "read:current_user update:current_user_metadata",
      }}
    >
      {children}
    </Auth0Provider>
  );
};

// TO BE UPDATED

// import { Auth0Provider } from "@auth0/auth0-react";
// import React from "react";
// import { useNavigate } from "react-router-dom";

// export const Auth0ProviderWithNavigate = ({ children }) => {
//   const navigate = useNavigate();

//   const domain = process.env.REACT_APP_AUTH0_DOMAIN;
//   const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
//   const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;

//   const onRedirectCallback = (appState) => {
//     navigate(appState?.returnTo || window.location.pathname);
//   };

//   if (!(domain && clientId && redirectUri)) {
//     return null;
//   }

//   return (
//     <Auth0Provider
//       domain={domain}
//       clientId={clientId}
//       authorizationParams={{
//         redirect_uri: redirectUri,
//       }}
//       onRedirectCallback={onRedirectCallback}
//     >
//       {children}
//     </Auth0Provider>
//   );
// };
