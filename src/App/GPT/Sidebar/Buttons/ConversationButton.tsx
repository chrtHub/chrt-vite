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
        "mb-2 mt-1 inline-flex w-full items-center justify-center gap-x-1.5 rounded-md border-zinc-400 bg-zinc-300 px-2.5 py-1.5 text-sm font-semibold text-zinc-800 shadow-sm",
        //-- Hover --//
        "hover:border-zinc-400 hover:bg-zinc-400 hover:text-zinc-50",
        //-- Focus --//
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600",
        //-- Dark --//
        "dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-600"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
