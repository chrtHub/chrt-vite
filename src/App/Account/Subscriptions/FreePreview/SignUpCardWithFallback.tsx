//== react, react-router-dom, Auth0 ==//
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../../Context/AccountContext";
import { ErrorBoundary } from "react-error-boundary";
import addRole from "../Util/addRole";

//== NPM Components ==//

//== Icons ==//
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

//== NPM Functions ==//

//== Utility Functions ==//
import { getUsersPermissions } from "../Util/getUserPermissions";
import { isRoleActive } from "../Util/isRoleActive";
import classNames from "../../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
const ROLE_NAME = "Free Preview Access"; //-- BASED ON AUTH0 --//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  setRemoveFreePreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function SignUpCardWithFallback({
  setRemoveFreePreviewModalOpen,
}: IProps) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Component
        setRemoveFreePreviewModalOpen={setRemoveFreePreviewModalOpen}
      />
    </ErrorBoundary>
  );
}

//-- ***** ***** ***** COMPONENT ***** ***** ***** --//
const Component = ({ setRemoveFreePreviewModalOpen }: IProps) => {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  //== Auth ==//

  //== Other ==//
  async function fetchPermissions() {
    let accessToken = await getAccessTokenSilently();
    try {
      await getUsersPermissions(accessToken, AccountContext);
    } catch (err) {
      showBoundary(err);
    }
    AccountContext.setRolesFetched(true);
  }

  //== Side Effects ==//
  //-- On mount, get user permissions --//
  useEffect(() => {
    fetchPermissions();
  }, []);

  //== Event Handlers ==//

  const addFreePreviewHandler = async () => {
    try {
      AccountContext.setChangingFreePreview(true);

      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Add role --//
      await addRole(accessToken, AccountContext, ROLE_NAME);

      //-- Force a fetch of the new auth token with added permissions from Auth0 --//
      accessToken = await getAccessTokenSilently({ cacheMode: "off" });

      //-- Update listed permissions --//
      await getUsersPermissions(accessToken, AccountContext);

      AccountContext.setChangingFreePreview(false);
    } catch (err) {
      AccountContext.setChangingFreePreview(false);
      throw err;
    }
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-zinc-100 py-10 pb-4 text-center ring-1 ring-inset ring-zinc-900/5 dark:bg-zinc-700 lg:pt-8">
      <div className="mx-auto px-8">
        {/* START OF TOP */}
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
        {/* END OF TOP */}

        {/* START OF ADD FREE PREVIEW BUTTON */}
        <button
          type="button"
          disabled={isRoleActive(ROLE_NAME, AccountContext)}
          onClick={addFreePreviewHandler}
          className={classNames(
            "tex-stm mt-4 w-64 items-center gap-x-2 rounded-md px-3.5 py-2.5 text-center font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            !AccountContext.rolesFetched
              ? "animate-pulse bg-zinc-200 text-zinc-500"
              : AccountContext.changingFreePreview
              ? "animate-pulse cursor-not-allowed bg-zinc-200 text-zinc-900"
              : isRoleActive(ROLE_NAME, AccountContext)
              ? "cursor-not-allowed bg-green-800 text-white"
              : !isRoleActive(ROLE_NAME, AccountContext)
              ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
              : ""
          )}
        >
          {!AccountContext.rolesFetched ? (
            <div className="flex flex-row items-center justify-center">
              <p className="mr-2 text-sm">Loading...</p>
            </div>
          ) : AccountContext.changingFreePreview ? (
            <div className="flex flex-row items-center justify-center">
              <p className="mr-2 text-sm">Updating...</p>
            </div>
          ) : isRoleActive(ROLE_NAME, AccountContext) ? (
            <div className="flex flex-row items-center justify-center">
              <p className="mr-2 text-sm">{ROLE_NAME} Active</p>
              <CheckCircleIcon className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center">
              <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
              <p className="ml-2 text-sm">Add {ROLE_NAME}</p>
            </div>
          )}
        </button>
        {/* END OF ADD FREE PREVIEW BUTTON */}

        {/* REIMBURSEMENTS NOTE */}
        <p className="mt-3 w-64 text-xs leading-5 text-zinc-600 dark:text-zinc-300">
          Invoices and receipts would be available for easy company
          reimbursement...but it's free
        </p>
        {/*----*/}
      </div>

      {/* START OF CANCEL FREE PREVIEW BUTTON */}
      {isRoleActive("Free Preview Access", AccountContext) && (
        <button
          type="button"
          onClick={() => setRemoveFreePreviewModalOpen(true)}
          className="mt-6 w-16 rounded-full bg-rose-50 px-1 py-0.5 text-xs font-semibold text-rose-500 shadow-sm ring-1 ring-inset ring-rose-200 hover:bg-rose-100 dark:bg-rose-900 dark:text-rose-100 dark:ring-rose-900 dark:hover:bg-rose-800"
        >
          Cancel
        </button>
      )}
      {/* END OF CANCEL FREE PREVIEW BUTTON */}
    </div>
  );
};

//-- ***** ***** ***** FALLBACK ***** ***** ***** --//
const Fallback = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-yellow-200 py-10 pb-4 text-center ring-1 ring-inset ring-zinc-900/5 dark:bg-yellow-900 lg:pt-8">
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
