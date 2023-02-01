import React from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate";

import Layout from "./Components/Layout";

import Home from "./Components/Home/Home";
import Journal from "./Components/JournalService/Journal";
import Data from "./Components/DataService/Data";
import Settings from "./Components/Settings/Settings";
import Profile from "./Components/Profile/Profile";

import Callback from "./UI/Callback";
import NotFoundPage from "./UI/NotFoundPage";

import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Auth0ProviderWithNavigate />}>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="journal" element={<Journal />} />
        <Route path="data" element={<Data />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="callback" element={<Callback />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
