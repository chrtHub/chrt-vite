//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import Tooltip from "../../Components/Tooltip";
import TypographyWrapper from "../TypographyWrapper";
import TermsOfService from "./TermsOfService.mdx";

//-- NPM Components --//

//-- Icons --//
import {
  ArrowDownOnSquareIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

const pdfURL =
  "https://chrt-legal-public.s3.amazonaws.com/2023-06-12-TermsOfService.pdf";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Terms() {
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="mt-6 flex w-full max-w-prose flex-row justify-end pr-3">
        {/* DOWNLOAD PDF */}
        <button
          type="button"
          className="rounded bg-indigo-100 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-200 dark:bg-indigo-500 dark:text-indigo-50 dark:hover:bg-indigo-400"
        >
          <a href={pdfURL} rel="noopener noreferrer" target="_blank">
            PDF Format
          </a>
        </button>
      </div>

      {/* Markdown Content */}
      <TypographyWrapper>
        <TermsOfService />
      </TypographyWrapper>
    </div>
  );
}
