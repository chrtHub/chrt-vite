//== react, react-router-dom, Auth0 ==//

import { PropsWithChildren } from "react";

//== TSX Components, Functions ==//

//== NPM Components ==//
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps extends PropsWithChildren {
  title: string;
  fetched: boolean;
  updating: boolean;
}
export default function EChartContainer({
  children,
  title,
  fetched,
  updating,
}: IProps) {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div
      className={classNames(
        `h-full w-full`,
        "flex flex-col rounded-2xl px-0.5 pb-3 pt-4 shadow-md",
        "ring-1 ring-inset ring-zinc-800/10 dark:ring-zinc-100/10",
        "bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100",
        !fetched || updating ? "animate-pulse" : ""
      )}
    >
      {/* Title */}
      <p className="mx-8 text-center font-medium text-zinc-600 dark:text-zinc-200">
        {title}
      </p>

      {children}
    </div>
  );
}
