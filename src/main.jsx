import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
