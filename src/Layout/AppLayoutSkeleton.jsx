//-- react, react-router-dom, Auth0 --//
import { Outlet } from "react-router-dom";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//
let DIV_COUNT = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function AppLayoutSkeleton(props) {
  let { hideOutlet } = props;

  return (
    <div className="h-full overflow-auto bg-zinc-100 dark:bg-zinc-700">
      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col bg-zinc-200 dark:bg-zinc-800">
          <div className="flex h-16 flex-shrink-0 items-center bg-zinc-300 px-4 dark:bg-zinc-900">
            <a
              href={window.location.origin}
              className="h-8 w-auto font-sans text-3xl font-semibold text-zinc-900 dark:text-white "
            >
              chrt
            </a>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {/*  */}
              {DIV_COUNT.map((item) => (
                <div
                  key={item.id}
                  id={item.id}
                  className="group flex animate-pulse items-center rounded-md bg-zinc-300 px-2 py-2 text-sm font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white"
                >
                  <EllipsisHorizontalCircleIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-zinc-400 dark:text-zinc-800"
                    aria-hidden="true"
                  />
                </div>
              ))}
              {/*  */}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow dark:bg-zinc-800">
          <button
            type="button"
            className="border-r border-zinc-300 px-4  text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 dark:border-zinc-600 md:hidden"
          ></button>
          <div className="flex flex-1 justify-between px-4">
            {/* Search field */}
            <div className="flex flex-1">
              <div className="flex w-full md:ml-0">
                <div className="relative w-full text-zinc-600 focus-within:text-zinc-800 dark:text-zinc-400  dark:focus-within:text-white">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <MagnifyingGlassIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    disabled
                    id="search-field"
                    type="search"
                    className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-zinc-900 placeholder-zinc-500 focus:border-transparent focus:placeholder-zinc-400 focus:outline-none focus:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 dark:focus:placeholder-zinc-500 sm:text-sm"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>

            {/* Profile icon */}
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative ml-3">
                <div>
                  <div className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-500 dark:focus:ring-zinc-500">
                    <UserCircleIcon className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/*  */}
          </div>
        </div>
        <main className="flex-1">{!hideOutlet && <Outlet />}</main>
      </div>
    </div>
  );
}
