//== react, react-router-dom, Auth0 ==//
import { useState } from "react";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";

//== NPM Components ==//
import { CheckIcon } from "@heroicons/react/20/solid";

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import AddFreePreviewAccessButton from "./AddFreePreviewAccessButton";
import RemoveFreePreviewAccessModal from "./RemoveFreePreviewAccessModal";
import CancelFreePreviewAccessButton from "./CancelFreePreviewAccessButton";
import { isRoleActive } from "./isRoleActive";

const includedFeatures = [
  "Trading Journal",
  "Journal Files Service",
  "ChrtGPT",
  "New features when they launch",
];

const ROLE_NAME = "Free Preview Access";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Subscriptions() {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();
  const [removeFreePreviewAccessModal, setRemoveFreePreviewAccessModalOpen] =
    useState<boolean>(false);

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//-

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="px-3 pb-3 lg:px-0">
      {/* Modals */}
      <RemoveFreePreviewAccessModal
        modalOpen={removeFreePreviewAccessModal}
        setModalOpen={setRemoveFreePreviewAccessModalOpen}
      />

      {/* "Welcome to the Free Preview" Section */}
      {/* <div className="mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200 lg:text-4xl">
          Welcome to the Free Preview
        </h2>
        <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          No credit card required
        </p>
      </div> */}

      {/* START OF FREE PREVIEW ACCESS BOX */}
      <div className="mx-auto mb-4 mt-2 rounded-3xl bg-zinc-50 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700 lg:mx-0 lg:flex">
        {/* START OF LHS */}
        <div className="p-6">
          {/* Header */}
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200">
            Free Preview Access
          </h3>

          {/* Subheader */}
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Enjoy free access to CHRT as a part of our Free Preview
          </p>

          {/* "What's Included" Header */}
          <div className="mt-4 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400">
              What’s included
            </h4>
            <div className="h-px flex-auto bg-zinc-200" />
          </div>
          {/* What's Included List */}
          <ul
            role="list"
            className="mt-4 grid grid-cols-1 gap-4 text-sm leading-6 text-zinc-600 lg:grid-cols-2 lg:gap-6"
          >
            {includedFeatures.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                  aria-hidden="true"
                />
                <p className="dark:text-zinc-300">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
        {/* END OF LHS */}

        {/* START OF RHS */}
        <div className="ml-auto mt-0 p-2">
          {/* RHS Box */}
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
        </div>
        {/* END OF RHS */}
      </div>
      {/* END OF FREE PREVIEW ACCESS BOX */}
    </div>
  );
}
