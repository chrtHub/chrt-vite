//== react, react-router-dom, Auth0 ==//
import { PropsWithChildren } from "react";

//== TSX Components, Functions ==//
import { useJournalContext } from "../../Context/JournalContext";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps extends PropsWithChildren {
  title: string;
}
export default function EChartWrapper({ children, title }: IProps) {
  //== React State, Custom Hooks ==//
  let JC = useJournalContext();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div
      className={classNames(
        "mt-1 rounded-2xl px-3 pb-3 pt-4",
        "shadow-md",
        "ring-1 ring-inset ring-zinc-800/10 dark:ring-zinc-100/10",
        JC.pl45DaysFetched
          ? "animate-pulse bg-zinc-100 dark:bg-zinc-800"
          : "bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100"
      )}
    >
      {/* Title */}
      <p className="text-center font-medium text-zinc-600 dark:text-zinc-200">
        {title}
      </p>
      {children}
    </div>
  );
}
