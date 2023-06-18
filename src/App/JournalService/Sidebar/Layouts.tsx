//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { useJournalContext } from "../../../Context/JournalContext";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../../Util/classNames";
import { LayoutsOption } from "../Types/journal_types";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Layouts() {
  //== React State, Custom Hooks ==//
  let JC = useJournalContext();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full flex-col items-center justify-start rounded-lg bg-zinc-200 dark:bg-zinc-800">
      <p className="dark:text-zinc-200">layouts options</p>
      {JC.layoutsOptions.map((layoutsOption) => {
        return (
          <div key={layoutsOption.name}>
            <button
              className="m-2 rounded-lg bg-blue-500 p-2"
              onClick={() => {
                JC.setLayouts(layoutsOption.layoutsObject);
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
