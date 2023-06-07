//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import InfoPagesNav from "../InfoPagesNav";

//== NPM Components ==//

//== Icons ==//
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Support() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      <InfoPagesNav />
      <div className="isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Contact Support
          </h2>
          <p className="mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Is something not working?
            <br />
            Contact us! :)
          </p>
        </div>
        <div className="mx-auto mt-6 max-w-lg space-y-16">
          {/* Technical Support */}
          <div className="flex gap-x-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
              <ComputerDesktopIcon
                className="h-8 w-8 text-white"
                aria-hidden="true"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
                Technical support
              </h3>
              <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">
                You can reach us by email at support@chrt.com
              </p>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </>
  );
}
