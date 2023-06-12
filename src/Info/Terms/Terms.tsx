//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import Tooltip from "../../Components/Tooltip";
import TypographyWrapper from "../TypographyWrapper";
import TermsDoc from "./TermsDoc.mdx";

//-- NPM Components --//

//-- Icons --//
import {
  ArrowDownOnSquareIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Terms() {
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="mt-6 flex w-full max-w-prose flex-row justify-end gap-x-3 pr-3">
        {/* PRINT */}
        <Tooltip content="Print" placement="top">
          <button className="text-indigo-800 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400">
            <PrinterIcon className="h-8 w-8" />
          </button>
        </Tooltip>

        {/* DOWNLOAD */}
        <Tooltip content="Download" placement="top">
          <button className="text-indigo-800 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-400">
            <ArrowDownOnSquareIcon className="h-8 w-8" />
          </button>
        </Tooltip>
      </div>

      {/* Markdown Content */}
      <TypographyWrapper>
        <TermsDoc />
      </TypographyWrapper>
    </div>
  );
}
