//== react, react-router-dom, Auth0 ==//
import { NavLink } from "react-router-dom";
//== TSX Components, Functions ==//

//== NPM Components ==//

//== Icons ==//
import classNames from "../../Util/classNames";

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ActiveDevelopmentBanner() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      <NavLink to={"/roadmap"}>
        <div
          className={classNames(
            "my-3 flex items-center justify-center gap-x-6 rounded-md px-6 py-2.5 text-center sm:px-3.5",
            "bg-indigo-600 hover:bg-indigo-500",
            "dark:bg-indigo-900 dark:hover:bg-indigo-800"
          )}
        >
          <p className="text-sm leading-6 text-white">
            Currently in Active Development, click to view the roadmap&nbsp;
            <span aria-hidden="true">&rarr;</span>
          </p>
        </div>
      </NavLink>
    </>
  );
}
