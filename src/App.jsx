//-- react, react-router-dom, recoil, Auth0 --//
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//
import AppLayout from "./Layout/AppLayout";
import LandingPage from "./LandingPage/LandingPage";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import { H } from "highlight.run";

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//
const infoRoutes = [
  "/info",
  "/cookies",
  "/faq",
  "/oauth2_google",
  "/privacy",
  "/product_specific_terms",
  "/system_requirements",
  "/terms",
];
let VITE_HIGHLIGHT_ENV = import.meta.env.VITE_HIGHLIGHT_ENV;

//-- Scroll to top of page whenever pathname changes --//
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const rhsDiv = document.getElementById("rhs-div");
    rhsDiv.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function App() {
  //-- Without checking for user --> For Info routes, load AppLayout in infoMode --//
  if (infoRoutes.includes(window.location.pathname)) {
    return (
      <>
        <ScrollToTop />
        <AppLayout skeletonMode={false} infoMode={true} />
      </>
    );
  }

  //-- Check for authenticated user --//
  const { isLoading, isAuthenticated, user } = useAuth0();

  //-- Loading is complete, user is authenticated --> show the app --//
  if (isAuthenticated) {
    if (VITE_HIGHLIGHT_ENV === "production") {
      //-- Identify user in Highlight --//
      H.identify(user?.email, {
        id: user?.sub,
        phone: user?.phone,
        avatar: user?.picture, // TODO - verify that this works
        // TODO - add versioning
      });
    }

    return <AppLayout skeletonMode={false} infoMode={false} />;
  }

  //-- Loading is complete and no authenticated user was found --//
  if (!isLoading && !isAuthenticated) {
    //-- For the '/' route, show the landing page --//
    if (window.location.pathname === "/") {
      return <LandingPage />;
    } else {
      //-- For all other routes, show the AppLayout in skeleton mode. The AuthGuard will redirect user to sign in. --//
      return <AppLayout skeletonMode={true} infoMode={false} />;
    }
  }
}
