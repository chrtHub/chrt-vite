//== react, react-router-dom, Auth0 ==//
import { useState } from "react";

//== TSX Components, Functions ==//

import RemoveFreePreviewAccessModal from "./RemoveFreePreviewAccessModal";
import RHSWithFallback from "./RHSWithFallback";

//== NPM Components ==//
import { CheckIcon } from "@heroicons/react/20/solid";

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

const includedFeatures = [
  "Trading Journal",
  "Journal Files Service",
  "ChrtGPT",
  "New features when they launch",
];

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Subscriptions() {
  //== React State, Custom Hooks ==//
  const [removeFreePreviewAccessModal, setRemoveFreePreviewAccessModalOpen] =
    useState<boolean>(false);

  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="px-3 pb-3 lg:px-0">
      {/* Modals */}
      <RemoveFreePreviewAccessModal
        modalOpen={removeFreePreviewAccessModal}
        setModalOpen={setRemoveFreePreviewAccessModalOpen}
      />
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
          <RHSWithFallback
            setRemoveFreePreviewAccessModalOpen={
              setRemoveFreePreviewAccessModalOpen
            }
          />
        </div>
        {/* END OF RHS */}
      </div>
      {/* END OF FREE PREVIEW ACCESS BOX */}
    </div>
  );
}
