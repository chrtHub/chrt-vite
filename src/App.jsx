//-- react, react-router-dom, recoil, Auth0 --//
import { RecoilRoot } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//
import AppLayout from "./Layout/AppLayout";
import LandingPage from "./LandingPage/LandingPage";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//
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

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function App() {
  //-- Without checking for user --> For Info routes, load AppLayout in infoMode --//
  if (infoRoutes.includes(window.location.pathname)) {
    return <AppLayout skeletonMode={false} infoMode={true} />;
  }

  //-- Check for authenticated user --//
  const { isLoading, isAuthenticated, user } = useAuth0();

  //-- Loading is complete, user is authenticated --> show the app --//
  if (isAuthenticated) {
    //-- Identify user in Highlight --//
    H.identify(user?.email, {
      id: user?.sub,
      phone: user?.phone,
    });

    return (
      <RecoilRoot>
        <AppLayout skeletonMode={false} infoMode={false} />
      </RecoilRoot>
    );
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
