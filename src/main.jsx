//-- react, react-router-dom, Auth0 --//
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate";

//-- JSX Components --//
import AuthGuard from "./auth/AuthGuard";
import App from "./App/App";
import Home from "./App/Home/Home";
import Journal from "./App/JournalService/Journal";
import Data from "./App/DataService/Data";
import Settings from "./App/Settings/Settings";
import Profile from "./App/Profile/Profile";
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
        <Route path="/journal" element={<AuthGuard component={Journal} />} />
        <Route path="/data" element={<AuthGuard component={Data} />} />
        <Route path="/settings" element={<AuthGuard component={Settings} />} />
        <Route path="/profile" element={<AuthGuard component={Profile} />} />
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
