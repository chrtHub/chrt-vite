//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useJournalContext } from "../../../Context/JournalContext";

//== NPM Components ==//

//== Icons ==//
import { BsCloudCheck } from "react-icons/bs";

//== NPM Functions ==//
import { useMediaQuery } from "usehooks-ts";

//== Utility Functions ==//
import classNames from "../../../Util/classNames";
import { ILayoutsOption } from "../Types/journal_types";
import { breakpoints } from "../../../Util/TailwindBreakpoints";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Layouts() {
  //== React State, Custom Hooks ==//
  let JC = useJournalContext();

  //== Auth ==//
  //== Other ==//
  const md = useMediaQuery(`(min-width: ${breakpoints.md})`);

  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full flex-col items-center justify-start rounded-lg bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200">
      {/* Narrow mode? */}
      {!md ? <p>narrow mode</p> : <p>not narrow mode</p>}

      <div className="mb-8 rounded-lg bg-zinc-700 p-6">
        {/* Saves / Unsaved Layouts */}
        {JC.unsavedLayoutsChanges ? (
          <>
            <p className="dark:text-zinc-200">unsaved changes</p>
            <p className="dark:text-zinc-200">click to save</p>
            <CloudArrowUpIcon className="h-6 w-6 dark:text-zinc-200" />
          </>
        ) : (
          <>
            <p className="dark:text-zinc-200">saved</p>
            <BsCloudCheck className="h-6 w-6 dark:text-zinc-200" />
          </>
        )}
      </div>

      {/* List of Layouts Options */}
      <p className="dark:text-zinc-200">layouts options</p>
      {JC.layoutsOptions.map((layoutsOption) => {
        return (
          <div key={layoutsOption.name}>
            <button
              className="m-2 rounded-lg bg-blue-500 p-2"
              onClick={() => {
                JC.setLayouts(layoutsOption.layouts);
              }}
            >
              <p>{layoutsOption.name}</p>
            </button>
          </div>
        );
      })}
    </div>
  );
}
