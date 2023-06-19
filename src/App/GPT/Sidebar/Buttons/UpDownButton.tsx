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
        "inline-flex w-full items-center justify-center gap-x-1.5 rounded-md px-2.5 py-1 text-sm font-semibold",
        "ring-inset",
        //-- Specific --//
        frozen
          ? classNames(
              "cursor-not-allowed",
              "bg-zinc-100 text-zinc-300",
              "dark:bg-zinc-800 dark:text-zinc-600"
            )
          : classNames(
              "ring-1",
              "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-500",
              "dark:text-zinc-300 dark:hover:bg-zinc-600 dark:hover:text-zinc-100",
              "ring-zinc-300",
              "dark:ring-zinc-600"
            )
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
