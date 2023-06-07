//-- react, react-router-dom, Auth0 --//
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

//-- TSX Components: Home --//
import Home from "./App/Home/Home";
import AuthProviderWithNavigateAndContexts from "./Auth/AuthProviderWithNavigateAndContexts";
import AuthGuard from "./Auth/AuthGuard";

//-- TSX Components: App --//
import App from "./App";
import RedirectToSignIn from "./Navigation/RedirectToSignIn";
import Data from "./App/DataService/Data";
import Journal from "./App/JournalService/Journal";
import JournalFiles from "./App/JournalFiles/JournalFiles";
import GPT from "./App/GPT/GPT";

//-- TSX Components: Account --//
import AccountOutlet from "./App/Account/AccountOutlet";
import Account from "./App/Account/Account";
import Subscriptions from "./App/Account/Subscriptions/Subscriptions";
import DevResources from "./App/Account/DevResources";

//-- TSX Components: Settings --//
import Settings from "./App/Settings/Settings";

//-- TSX Components: Info --//
import Cookies from "./Info/Cookies/Cookies";
import FAQ from "./Info/FAQ/FAQ";
import OAuth2Google from "./Info/OAuth2Google/OAuth2Google";
import Privacy from "./Info/Privacy/Privacy";
import Support from "./Info/Support/Support";
import SystemRequirements from "./Info/SystemRequirements/SystemRequirements";
import Terms from "./Info/Terms/Terms";

//-- TSX Components: Navigation --//
import NotFoundPage from "./Navigation/NotFoundPage";

//-- TSX Components: Errors --//
import RouteErrorBoundary from "./Errors/RouteErrorBoundary";

//-- Other --//

//-- CSS --//
import "./index.css";

//-- Create router object --//
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthProviderWithNavigateAndContexts />}
      errorElement={<RouteErrorBoundary />}
    >
      {/* App */}
      <Route path="/" element={<App />}>
        {/* Services */}
        <Route index element={<Home />} />
        <Route path="/data" element={<AuthGuard component={Data} />} />
        <Route path="/journal" element={<AuthGuard component={Journal} />} />
        <Route path="/files" element={<AuthGuard component={JournalFiles} />} />
        <Route
          path="gpt/:entity_type?/:conversation_id?"
          element={<AuthGuard component={GPT} />}
        />

        {/* Account */}
        <Route
          path="/account"
          element={<AuthGuard component={AccountOutlet} />}
        >
          <Route index element={<Account />} />
          <Route
            path="/account/subscriptions"
            element={<AuthGuard component={Subscriptions} />}
          />
          <Route
            path="/account/settings"
            element={<AuthGuard component={Settings} />}
            errorElement={<RouteErrorBoundary />}
          />
        </Route>

        {/* Special  */}
        <Route path="/dev" element={<AuthGuard component={DevResources} />} />
        <Route
          path="/signin"
          element={<AuthGuard component={RedirectToSignIn} />}
        />

        {/* Info Pages */}
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/oauth2_google" element={<OAuth2Google />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
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
    <ErrorBoundary
      FallbackComponent={() => {
        return <p>ErrorBoundary</p>;
      }}
      // DEV BELOW - option for error logging
      // onError={(error, componentStack) => {
      // logToErrorMonitoring(error, componentStack)
      // }}
      // onReset={(details) => {}}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
