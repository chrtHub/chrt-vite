//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import AppLayout from "./Layout/AppLayout";
import LandingPage from "./LandingPage/LandingPage";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//
const infoRoutes: string[] = [
  "/info",
  "/cookies",
  "/faq",
  "/oauth2_google",
  "/privacy",
  "/product_specific_terms",
  "/system_requirements",
  "/terms",
];

//-- Scroll to top of page whenever pathname changes --//
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const rhsDiv = document.getElementById("rhs-div");
    rhsDiv?.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {}
export default function App({}: IProps) {
  //-- React state --//

  //-- Before checking for user --> For Info routes, load AppLayout in infoMode --//
  if (infoRoutes.includes(window.location.pathname)) {
    return (
      <>
        <ScrollToTop />
        <AppLayout infoMode={true} />
      </>
    );
  }

  //-- Check for authenticated user --//
  const { isLoading, isAuthenticated, user } = useAuth0();
  let auth0Stuff = false;

  try {
    //-- Check cookies (used for desktop) for Auth0 stuff --//
    const auth0Cookies = document.cookie
      .split("; ")
      .filter((cookie) => cookie.includes("auth0"));
    if (auth0Cookies.length > 0) {
      auth0Stuff = true;
    }

    //-- Check localStorage (used for mobile) for Auth0 stuff --//
    for (let key in localStorage) {
      if (key.includes("auth0")) {
        auth0Stuff = true;
      }
    }
  } catch (e) {
    console.log(e);
  }

  //-- Loading is complete, user is authenticated --> show the app --//
  if (isAuthenticated) {
    return <AppLayout infoMode={false} />;
  }

  //-- isLoading starts as 'true'. Only show AppLayout if auth0Stuff found --//
  if (isLoading && auth0Stuff) {
    return <AppLayout infoMode={false} />;
  }

  //-- Loading is complete and no authenticated user was found --//
  if (!isLoading && !isAuthenticated) {
    //-- For the '/' route, show the landing page --//
    if (window.location.pathname === "/") {
      return <LandingPage />;
    } else {
      //-- For protected routes, Outlet renders the AuthGuard component, redirecting users to sign in --//
      return <AppLayout infoMode={false} />;
    }
  }

  return <></>; //-- In the name of type safety, this prevents returning 'undefined' --//
}
