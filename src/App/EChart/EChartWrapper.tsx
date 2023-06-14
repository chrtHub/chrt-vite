//== react, react-router-dom, Auth0 ==//
import { PropsWithChildren } from "react";

//== TSX Components, Functions ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  title: string;
  loading: boolean;
  height: string;
  width: string;
}
export default function EChartWrapper({
  children,
  title,
  loading,
  height,
  width,
}: PropsWithChildren & IProps) {
  //== React State, Custom Hooks ==//

  //== Auth ==//

  //== Other ==//
  const tw_height = `h-[${height}]`;
  const tw_width = `w-[${width}]`;

  //== Side Effects ==//

  //== Handlers ==//

  const _loading = true; // dev
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div
      className={classNames(
        "mt-1 rounded-2xl px-3 pb-3 pt-4",
        "shadow-md",
        "ring-1 ring-inset ring-zinc-800/10 dark:ring-zinc-100/10",
        _loading
          ? "animate-pulse bg-zinc-200 dark:bg-zinc-800"
          : "bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100"
      )}
    >
      {/* Title */}
      <p className="text-center font-medium text-zinc-600 dark:text-zinc-200">
        {title}
      </p>
      {/* Chart */}
      {_loading ? (
        <div className={classNames(`${tw_height} ${tw_width}`)} />
      ) : (
        children
      )}
    </div>
  );
}
