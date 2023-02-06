//-- react, react-router-dom, Auth0 --//
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Auth0ProviderWithNavigate from "./Auth/Auth0ProviderWithNavigate";
import AuthGuard from "./Auth/AuthGuard";

//-- JSX Components --//
import App from "./App/App";
import Home from "./App/Home/Home";

import Journal from "./App/JournalService/Journal";
import Files from "./App/JournalService/Files";
import Data from "./App/DataService/Data";
import Settings from "./App/Settings/Settings";
import Profile from "./App/Profile/Profile";

import Info from "./Info/Info";
import Terms from "./Info/Terms/Terms";
import Privacy from "./Info/Privacy/Privacy";
import OAuth2Google from "./Info/OAuth2Google/OAuth2Google";
import SystemRequirements from "./Info/SystemRequirements/SystemRequirements";

import Callback from "./UI/Callback";
import NotFoundPage from "./UI/NotFoundPage";

//-- CSS --//
import "./index.css";

//-- Create router object --//
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Auth0ProviderWithNavigate />}>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />

        {/* App */}
        <Route path="/journal" element={<AuthGuard component={Journal} />} />
        <Route path="/files" element={<AuthGuard component={Files} />} />
        <Route path="/data" element={<AuthGuard component={Data} />} />
        <Route path="/settings" element={<AuthGuard component={Settings} />} />
        <Route path="/profile" element={<AuthGuard component={Profile} />} />

        {/* Info */}
        <Route path="/info" element={<Info />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/oauth2_google" element={<OAuth2Google />} />
        <Route path="/system_requirements" element={<SystemRequirements />} />
        <Route path="/callback" element={<Callback />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

//-- ***** ***** ***** Root Element ***** ***** ***** --//
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
