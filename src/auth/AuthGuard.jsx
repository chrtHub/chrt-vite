//-- react, react-router-dom, Auth0 --//
import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//
import { LockClosedIcon } from "@heroicons/react/24/outline";

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AuthGuard({ component }) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="flex justify-center">
        <LockClosedIcon className="h-64 w-64 text-gray-400" />
      </div>
    ),
  });

  return <Component />;
}
