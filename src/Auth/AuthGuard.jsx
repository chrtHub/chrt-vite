//-- react, react-router-dom, Auth0 --//
import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

//-- TSX Components --//

//-- NPM Components --//
import { LockClosedIcon } from "@heroicons/react/24/outline";

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AuthGuard({ component }) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div />,
  });

  return <Component />;
}
