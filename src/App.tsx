//-- react, react-router-dom, Auth0 --//
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import AppLayout from "./Layout/AppLayout";
import LandingPage from "./LandingPage/LandingPage";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IAppProps {}
export default function App({}: IAppProps) {
  //-- React state --//

  //-- ***** ***** ***** Authenticated Users ***** ***** ***** --//
  //-- Check for authenticated user --//
  const { isLoading, isAuthenticated } = useAuth0();
  let auth0Stuff = false;

  //-- Check for desktop of mobile --//
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
  } catch (err) {
    console.log(err);
  }

  //-- Loading is complete, user is authenticated --> show the app --//
  if (isAuthenticated) {
    return <AppLayout />;
  }
  //-- ***** ***** *****  ***** ***** ***** --//

  //-- isLoading starts as 'true'. Only show AppLayout if auth0Stuff found --//
  if (isLoading && auth0Stuff) {
    return <AppLayout />;
  }

  //-- Loading is complete and no authenticated user was found --//
  if (!isLoading && !isAuthenticated) {
    //-- For the '/' route, show the landing page --//
    if (window.location.pathname === "/") {
      return <LandingPage />;
    } else {
      //-- For protected routes, Outlet renders the AuthGuard component, redirecting users to sign in --//
      return <AppLayout />;
    }
  }

  return <></>; //-- In the name of type safety, this prevents returning 'undefined' --//
}
