//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//
import AppLayout from "./Layout/AppLayout";
import InfoLayout from "./Layout/InfoLayout";
import LandingPage from "../LandingPage/LandingPage";
import AppLayoutSkeleton from "./Layout/AppLayoutSkeleton";

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

  //-- For Info routes --//
  if (infoRoutes.includes(window.location.pathname)) {
    return <InfoLayout />;
  }

  //-- After SPA loads, Auth0 SDK always initializes isLoading to 'true', but if no user cookie is found, isLoading can become 'false' before first paint, avoiding UI flicker --//
  if (isLoading) {
    return <AppLayoutSkeleton hideOutlet={true} />;
  }
  if (isAuthenticated) {
    return <AppLayout />;
  }
  if (!isLoading && !isAuthenticated) {
    if (window.location.pathname === "/") {
      return <LandingPage />;
    } else {
      return <AppLayoutSkeleton hideOutlet={false} />;
    }
  }
}
