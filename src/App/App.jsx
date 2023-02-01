//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//
import Layout from "./Layout/Layout";
import LandingPage from "../LandingPage/LandingPage";
import LayoutSkeleton from "../UI/LayoutSkeleton";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  //-- After SPA loads, Auth0 SDK always initializes isLoading to 'true', but if no user cookie is found, isLoading can become 'false' before first paint, avoiding UI flicker --//
  if (!isLoading && !isAuthenticated) {
    return <LandingPage />;
  }
  if (isLoading) {
    return <LayoutSkeleton />;
  }
  if (isAuthenticated) {
    return <Layout />;
  }
}
