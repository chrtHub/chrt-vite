//-- react, react-router-dom, Auth0 --//

import { HomeModernIcon } from "@heroicons/react/24/outline";
import classNames from "../../Util/classNames";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Home() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <HomeModernIcon
        className={classNames(
          "h-36 w-36 hover:animate-spin",
          "rounded-lg",
          "text-zinc-500 hover:bg-green-500/20 hover:text-green-500"
        )}
      />
    </div>
  );
}
