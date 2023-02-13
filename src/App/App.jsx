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
  const { isLoading, isAuthenticated } = useAuth0();

  //-- For Info routes, use the InfoLayout --//
  if (infoRoutes.includes(window.location.pathname)) {
    return <AppLayout skeletonMode={false} infoMode={true} />;
  }

  // if (isLoading) {
  //   return <AppLayout skeletonMode={true} infoMode={false} />;
  // }
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
