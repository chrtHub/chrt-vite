//-- react, react-router-dom, Auth0 --//

import { Cog8ToothIcon } from "@heroicons/react/24/solid";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Settings() {
  return (
    <div className="flex h-64 w-full flex-row justify-start">
      <div className="flex w-full flex-col items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700 lg:w-2/3">
        <Cog8ToothIcon className="h-12 w-12 text-zinc-400" />
        <p className="mt-3 text-lg font-semibold text-zinc-400">
          For future use
        </p>
      </div>
    </div>
  );
}
