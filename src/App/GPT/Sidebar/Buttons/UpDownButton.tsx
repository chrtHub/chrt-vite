import { MouseEventHandler, ReactNode } from "react";

import classNames from "../../../../Util/classNames";

//-- Styled Button --//
interface StyledButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler;
  frozen: boolean;
}
export const UpDownButton: React.FC<StyledButtonProps> = ({
  children,
  onClick,
  frozen,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        //-- Normal --//
        "inline-flex w-full items-center justify-center gap-x-1.5 rounded-md border-2 px-2.5 py-1 text-sm font-semibold shadow-sm",
        //-- Hover --//
        frozen
          ? "cursor-not-allowed border-zinc-300 text-zinc-300 dark:text-zinc-600"
          : "border-zinc-600 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-400 hover:text-zinc-50 hover:shadow-md dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-600",
        //-- Focus --//
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
