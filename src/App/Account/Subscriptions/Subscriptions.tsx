//== react, react-router-dom, recoil, Auth0 ==//
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";

//== NPM Components ==//
import { CheckIcon } from "@heroicons/react/20/solid";

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import AddFreePreviewAccessButton from "./AddFreePreviewAccessButton";
import RemoveFreePreviewAccessButton from "./RemoveFreePreviewAccessButton";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

const includedFeatures = [
  "Trading Journal",
  "Journal Files Service",
  "ChrtGPT",
  "New features when they launch",
];

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Subscriptions() {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();
  const { getAccessTokenSilently, user } = useAuth0();

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* "Welcome to the Free Preview" Section */}
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200 sm:text-4xl">
            Welcome to the Free Preview
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            No credit card required
          </p>
        </div>

        {/* START OF FREE PREVIEW ACCESS BOX */}
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl bg-zinc-50 ring-1 ring-zinc-200 lg:mx-0 lg:flex lg:max-w-none">
          {/* START OF LHS */}
          <div className="p-8 sm:p-10 lg:flex-auto">
            {/* Header */}
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200">
              Free Preview Access
            </h3>

            {/* Subheader */}
            <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Enjoy free access to CHRT as a part of our Free Preview
            </p>

            {/* "What's Included" Header */}
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                What’s included
              </h4>
              <div className="h-px flex-auto bg-zinc-100" />
            </div>
            {/* What's Included List */}
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-zinc-600 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <p className="dark:text-zinc-500">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
          {/* END OF LHS */}

          {/* START OF RHS */}
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            {/* RHS Box */}
            <div className="rounded-2xl bg-zinc-100 py-10 text-center ring-1 ring-inset ring-zinc-900/5 dark:bg-zinc-900 lg:flex lg:flex-col lg:justify-center lg:py-16 ">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-zinc-600">
                  Limited time only
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    $0
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-zinc-600">
                    USD
                  </span>
                </p>
                {/* Add Free Preview Access Button */}
                <AddFreePreviewAccessButton />

                <p className="mt-6 text-xs leading-5 text-zinc-600 dark:text-zinc-500">
                  Invoices and receipts would be available for easy company
                  reimbursement...but it's free
                </p>
              </div>
            </div>
          </div>
          {/* END OF RHS */}
        </div>
        {/* END OF FREE PREVIEW ACCESS BOX */}
      </div>

      {/* START OF REMOVE FREE PREVIEW ACCESS BOX */}
      <div>
        <RemoveFreePreviewAccessButton />
      </div>
      {/* END OF REMOVE FREE PREVIEW ACCESS BOX */}
    </>
  );
}
