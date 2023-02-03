//-- react, react-router-dom, Auth0 --//
import { Outlet } from "react-router-dom";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function LayoutSkeleton() {
  return (
    <div className="h-full bg-zinc-100 dark:bg-zinc-700">
      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col bg-zinc-200 dark:bg-zinc-800">
          <div className="flex h-16 flex-shrink-0 items-center bg-zinc-300 px-4 dark:bg-zinc-900"></div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4"></nav>
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
            <div className="flex flex-1"></div>
            <div className="ml-4 flex items-center md:ml-6"></div>
          </div>
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
