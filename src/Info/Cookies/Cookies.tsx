//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import TypographyWrapper from "../TypographyWrapper";
import CookiesPolicy from "./CookiesPolicy.mdx";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

const pdfURL =
  "https://chrt-legal-public.s3.amazonaws.com/2023-06-12-CookiesPolicy.pdf";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Privacy() {
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
        <CookiesPolicy />
      </TypographyWrapper>
    </div>
  );
}
