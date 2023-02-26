//-- react, react-router-dom, Auth0 --//
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App";

//-- JSX Components: Home --//
import Home from "./App/Home/Home";
import AuthProviderWithNavigateAndRecoil from "./Auth/AuthProviderWithNavigateAndRecoil";
import AuthGuard from "./Auth/AuthGuard";

//-- JSX Components: App --//
import Data from "./App/DataService/Data";
import Journal from "./App/JournalService/Journal";
import JournalFiles from "./App/JournalFiles/JournalFiles";
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
import NotFoundPage from "./Navigation/NotFoundPage";

//-- Other --//
import { H, HighlightOptions } from "highlight.run";
let VITE_HIGHLIGHT_ENV: string = import.meta.env.VITE_HIGHLIGHT_ENV;

//-- CSS --//
import "./index.css";

//-- Initialize Highlight --//
if (VITE_HIGHLIGHT_ENV === "production") {
  const highlightOptions: HighlightOptions = {
    environment: VITE_HIGHLIGHT_ENV,
    enableStrictPrivacy: false,
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: false,
      urlBlocklist: [
        //-- TODO - work on this list --//
        "https://accounts.google.com",
        "https://accounts.youtube.com",
        "https://chrt-prod.us.auth0.com",
        "https://securetoken.googleapis.com", //-- included by default --//
        "https://www.googleapis.com/identitytoolkit", //-- included by default --//
      ],
    },
  };
  H.init("kevvxle3", highlightOptions);
}

//-- Create router object --//
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProviderWithNavigateAndRecoil />}>
      {/* App */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />

        <Route path="/data" element={<AuthGuard component={Data} />} />
        <Route path="/journal" element={<AuthGuard component={Journal} />} />
        <Route path="/files" element={<AuthGuard component={JournalFiles} />} />
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
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

//-- ***** ***** ***** Root Element ***** ***** ***** --//
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
