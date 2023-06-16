//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Layouts() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full flex-col">
      {/*-- DIVIDER --*/}
      <div className="mb-0.5">
        <div
          className={classNames(
            "rounded-full border-t-2 border-zinc-300 dark:border-zinc-500"
          )}
          aria-hidden="true"
        />
      </div>

      {/* TODO - new layout button, similar to New Converation button */}

      <p>Layouts</p>
    </div>
  );
}
