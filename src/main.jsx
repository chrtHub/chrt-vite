import React from "react";
import ReactDOM from "react-dom/client";

import {
  // Outlet,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Auth0Provider } from "@auth0/auth0-react";

import Layout from "./Components/Layout";
import Home from "./Components/Home/Home";
import Journal from "./Components/JournalService/Journal";
import Data from "./Components/DataService/Data";

import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="journal" element={<Journal />} />
      <Route path="data" element={<Data />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-u4trvdw25pkfbgaq.us.auth0.com"
      clientId="nJH6eXO0snTYdLQ2W9Zm6JndVwD4ActU" //-- Application: chrt-vite --//
      authorizationParams={{
        redirect_uri: window.location.origin,
        // audience: "https://dev-u4trvdw25pkfbgaq.us.auth0.com/api/v2/", //-- Auth0 Management API --//
        // // "TODO"//-- chrt API --//
        // scope: "read:current_user update:current_user_metadata",
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);
