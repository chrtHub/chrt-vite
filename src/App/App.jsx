//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//
import AppLayout from "../Layout/AppLayout";
import LandingPage from "../LandingPage/LandingPage";

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
  const { isLoading, isAuthenticated, user } = useAuth0();

  //-- For Info routes, use the InfoLayout --//
  if (infoRoutes.includes(window.location.pathname)) {
    return <AppLayout skeletonMode={false} infoMode={true} />;
  }

  //-- After SPA loads, Auth0 SDK always initializes isLoading to 'true', but if no user cookie is found, isLoading can become 'false' before first paint, avoiding UI flicker --//
  if (isLoading) {
    return <AppLayout skeletonMode={true} infoMode={false} />;
  }
  if (isAuthenticated) {
    return <AppLayout skeletonMode={false} infoMode={false} />;
  }
  if (!isLoading && !isAuthenticated) {
    if (window.location.pathname === "/") {
      return <LandingPage />;
    } else {
      return <AppLayout skeletonMode={true} infoMode={false} />;
    }
  }
}
