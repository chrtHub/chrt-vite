//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components, Functions ==//

//== NPM Components ==//
import { CheckIcon } from "@heroicons/react/20/solid";
import { NavLink } from "react-router-dom";

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
export default function Billing() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Event Handlers ==//

  // TODO - lots of bg and text colors to make nice

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="rounded-2xl py-24 dark:bg-zinc-800 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200 sm:text-4xl">
            Welcome to the Free Preview
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            No credit card required
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-zinc-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200">
              Free Preview Access
            </h3>
            <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Enjoy free access to CHRT as a part of our Free Preview
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                What’s included
              </h4>
              <div className="h-px flex-auto bg-zinc-100" />
            </div>
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
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-zinc-50 py-10 text-center ring-1 ring-inset ring-zinc-900/5 dark:bg-zinc-900 lg:flex lg:flex-col lg:justify-center lg:py-16">
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
                <NavLink
                  to="/account"
                  className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get access
                </NavLink>
                <p className="mt-6 text-xs leading-5 text-zinc-600 dark:text-zinc-500">
                  Invoices and receipts would be available for easy company
                  reimbursement...but it's free
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
