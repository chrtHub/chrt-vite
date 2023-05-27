//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import DevSandbox from "./DevSandbox/DevSandbox";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Settings() {
  return (
    <>
      <h2 className="border-b-2 border-zinc-300 pb-5 text-3xl font-bold text-zinc-900 dark:border-zinc-700 dark:text-zinc-200">
        Settings
      </h2>
      <DevSandbox />
    </>
  );
}
