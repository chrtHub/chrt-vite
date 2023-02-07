//-- react, react-router-dom, Auth0 --//
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App/App";

//-- JSX Components: Home --//
import Home from "./App/Home/Home";
// import AuthProviderWithNavigate from "./Auth/AuthProviderWithNavigate";
import DummyProvider from "./Navigation/DummyProvider";
import AuthGuard from "./Foo/AuthGuard";

//-- JSX Components: App --//
import Data from "./App/DataService/Data";
import Journal from "./App/JournalService/Journal";
import Files from "./App/JournalService/Files";
import Profile from "./App/Profile/Profile";
import Settings from "./App/Settings/Settings";

//-- JSX Components: Info --//
import Cookies from "./Info/Cookies/Cookies";
import FAQ from "./Info/FAQ/FAQ";
import Info from "./Info/Info";
import OAuth2Google from "./Info/OAuth2Google/OAuth2Google";
import Privacy from "./Info/Privacy/Privacy";
import SystemRequirements from "./Info/SystemRequirements/SystemRequirements";
import Terms from "./Info/Terms/Terms";

//-- JSX Components: Navigation --//
import Callback from "./Navigation/Callback";
import NotFoundPage from "./Navigation/NotFoundPage";

//-- CSS --//
import "./index.css";

//-- Create router object --//
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      // element={<AuthProviderWithNavigate />
      element={<DummyProvider />}
    >
      {/* App */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />

        <Route path="/data" element={<AuthGuard component={Data} />} />
        <Route path="/journal" element={<AuthGuard component={Journal} />} />
        <Route path="/files" element={<AuthGuard component={Files} />} />
        <Route path="/profile" element={<AuthGuard component={Profile} />} />
        <Route path="/settings" element={<AuthGuard component={Settings} />} />

        {/* Info */}
        <Route path="/info" element={<Info />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/oauth2_google" element={<OAuth2Google />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/system_requirements" element={<SystemRequirements />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Navigation */}
      <Route path="/callback" element={<Callback />} />
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
