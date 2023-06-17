import { MouseEventHandler, ReactNode } from "react";

import classNames from "../../../../Util/classNames";

//-- Conversation Button --//
interface ConversationButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler;
}
export const ConversationButton: React.FC<ConversationButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        //-- Normal --//
        "mb-1.5 inline-flex w-full items-center justify-center gap-x-1.5 rounded-2xl px-2.5 py-1.5 text-sm font-semibold shadow-sm",
        //----//
        "bg-green-300 text-green-800",
        //-- Hover --//
        "hover:bg-green-400 hover:text-green-900",
        //-- Focus --//
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600",
        //-- Dark --//
        "dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-700 dark:hover:text-green-100"
        // "dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-600"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
