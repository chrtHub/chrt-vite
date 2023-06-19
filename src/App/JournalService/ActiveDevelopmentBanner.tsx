//== react, react-router-dom, Auth0 ==//
import { NavLink } from "react-router-dom";
//== TSX Components, Functions ==//

//== NPM Components ==//

//== Icons ==//
import { XMarkIcon } from "@heroicons/react/24/solid";
import classNames from "../../Util/classNames";

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ActiveDevelopmentBanner({ setShowBanner }: IProps) {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      <div
        className={classNames(
          "mt-2 flex items-center justify-center gap-x-6 rounded-md px-6 py-2.5 text-center sm:px-3.5",
          "bg-indigo-600 hover:bg-indigo-500",
          "dark:bg-indigo-900 dark:hover:bg-indigo-800"
        )}
      >
        <NavLink to={"/journal_roadmap"} className={classNames("", "")}>
          <p className="text-sm leading-6 text-white">
            <strong className="font-semibold">CHRT Journal</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            currently in Active Development, click to view the roadmap&nbsp;
            <span aria-hidden="true">&rarr;</span>
          </p>
        </NavLink>
        {/* <div className="flex flex-1 justify-end">
          <button
            type="button"
            className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
            onClick={() => {
              setShowBanner(false);
            }}
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </div> */}
      </div>
    </>
  );
}
