//-- react, react-router-dom, Auth0 --//
import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {
  component: React.ComponentType;
}
export default function AuthGuard({ component }: IProps) {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div />,
  });

  return <Component />;
}
