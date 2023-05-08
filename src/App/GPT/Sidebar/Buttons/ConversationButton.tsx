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
        "mb-2 mt-1 inline-flex w-full items-center justify-center gap-x-1.5 rounded-md border-2 border-zinc-500 px-2.5 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm",
        //-- Hover --//
        "hover:border-green-600 hover:bg-green-600 hover:text-white",
        //-- Focus --//
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600",
        //-- Dark --//
        "dark:border-zinc-300 dark:text-zinc-100 dark:hover:border-green-700 dark:hover:bg-green-700"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
