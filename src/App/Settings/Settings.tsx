//-- react, react-router-dom, Auth0 --//
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//-- TSX Components --//
import DevSandbox from "./DevSandbox";

//-- NPM Components --//

//-- Icons --//
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Settings() {
  return (
    <>
      <div>Settings</div>
      <DevSandbox />
    </>
  );
}
