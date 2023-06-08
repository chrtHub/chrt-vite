//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import AddFreePreviewAccessButton from "./AddFreePreviewAccessButton";
import CancelFreePreviewAccessButton from "./CancelFreePreviewAccessButton";
import { useAccountContext } from "../../../Context/AccountContext";
import { ErrorBoundary } from "react-error-boundary";
import { throwAxiosError } from "../../../Errors/throwAxiosError";
import { getErrorDetails } from "../../../Errors/getErrorDetails";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//
import { isRoleActive } from "./isRoleActive";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

const ROLE_NAME = "Free Preview Access";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  setRemoveFreePreviewAccessModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}
export default function RHSWithFallback({
  setRemoveFreePreviewAccessModalOpen,
}: IProps) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Component
        setRemoveFreePreviewAccessModalOpen={
          setRemoveFreePreviewAccessModalOpen
        }
      />
    </ErrorBoundary>
  );
}

//-- ***** ***** ***** COMPONENT ***** ***** ***** --//
const Component = ({ setRemoveFreePreviewAccessModalOpen }: IProps) => {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();

  //== Auth ==//

  //== Other ==//
  throwAxiosError(400); // DEV

  //== Side Effects ==//

  //== Event Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-zinc-100 py-10 pb-4 text-center ring-1 ring-inset ring-zinc-900/5 dark:bg-zinc-700 lg:pt-8">
      <div className="mx-auto px-8">
        <p className="text-base font-semibold text-zinc-600 dark:text-zinc-100">
          Limited time only
        </p>
        <p className="mt-2 text-base font-semibold text-zinc-600 dark:text-zinc-100">
          No credit card required
        </p>
        {/* Price */}
        {!isRoleActive(ROLE_NAME, AccountContext) && (
          <p className="mt-2 flex items-baseline justify-center gap-x-2">
            <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              $0
            </span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-zinc-600 dark:text-zinc-200">
              USD
            </span>
          </p>
        )}
        {/* Add Free Preview Access Button */}
        <AddFreePreviewAccessButton />

        <p className="mt-3 w-64 text-xs leading-5 text-zinc-600 dark:text-zinc-300">
          Invoices and receipts would be available for easy company
          reimbursement...but it's free
        </p>
      </div>
      <CancelFreePreviewAccessButton
        setRemoveFreePreviewAccessModalOpen={
          setRemoveFreePreviewAccessModalOpen
        }
      />
    </div>
  );
};

//-- ***** ***** ***** FALLBACK ***** ***** ***** --//
const Fallback = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-yellow-100 py-10 pb-4 text-center ring-1 ring-inset ring-zinc-900/5 dark:bg-zinc-700 lg:pt-8">
      <div className="mx-auto px-8">
        <p className="text-base font-semibold text-zinc-600 dark:text-zinc-100">
          Auth Server temporarily unavailable
        </p>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-200">
          Please refresh the page to try again
        </p>
      </div>
    </div>
  );
};
