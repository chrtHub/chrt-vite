//-- react, react-router-dom, Auth0 --//
import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AuthGuard({ component }) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div>redirecting...</div>,
  });

  return <Component />;
}
