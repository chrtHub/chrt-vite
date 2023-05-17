//-- react, react-router-dom, Auth0 --//
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//-- TSX Components: Home --//
import Home from "./App/Home/Home";
import AuthProviderWithNavigateAndRecoil from "./Auth/AuthProviderWithNavigateAndRecoil";
import AuthGuard from "./Auth/AuthGuard";

//-- TSX Components: App --//
import App from "./App";
import Data from "./App/DataService/Data";
import Journal from "./App/JournalService/Journal";
import JournalFiles from "./App/JournalFiles/JournalFiles";
import GPT from "./App/GPT/GPT";
import Profile from "./App/Profile/Profile";
import Settings from "./App/Settings/Settings";

//-- TSX Components: Info --//
import Cookies from "./Info/Cookies/Cookies";
import FAQ from "./Info/FAQ/FAQ";
import Info from "./Info/Info";
import OAuth2Google from "./Info/OAuth2Google/OAuth2Google";
import Privacy from "./Info/Privacy/Privacy";
import SystemRequirements from "./Info/SystemRequirements/SystemRequirements";
import Terms from "./Info/Terms/Terms";
import Updates from "./Info/Updates/Updates";

//-- TSX Components: Navigation --//
import NotFoundPage from "./Navigation/NotFoundPage";

//-- TSX Components: Errors --//
import IndexErrorBoundary from "./App/Errors/IndexErrorBoundary";

//-- Other --//

//-- CSS --//
import "./index.css";

//-- Create router object --//
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProviderWithNavigateAndRecoil />}>
      {/* App */}
      <Route path="/" element={<App />} errorElement={<IndexErrorBoundary />}>
        <Route index element={<Home />} />

        <Route path="/data" element={<AuthGuard component={Data} />} />
        <Route path="/journal" element={<AuthGuard component={Journal} />} />
        <Route path="/files" element={<AuthGuard component={JournalFiles} />} />
        <Route
          path="gpt/:entity_type?/:conversation_id?"
          element={<AuthGuard component={GPT} />}
        />
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
        <Route path="/updates" element={<Updates />} />
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
