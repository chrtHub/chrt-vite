import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import classNames from "../../../Util/classNames";

export const DraggableHandle = () => {
  return (
    <div
      className={classNames(
        "react-grid-dragHandle cursor-move",
        "absolute right-0 top-0 z-20 mr-1.5 mt-2.5 rounded-full p-2",
        "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800",
        "dark:text-zinc-300 dark:hover:bg-zinc-600 dark:hover:text-zinc-100"
      )}
    >
      <ArrowsPointingOutIcon
        className="h-5 w-5"
        style={{ transform: "rotate(45deg)" }}
      />
    </div>
  );
};
