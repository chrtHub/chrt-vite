import TryCatchError from "../DevSandbox/TryCatchError";
import Backend500Error from "./Backend500Error";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function DevSandbox() {
  return (
    <>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-semibold leading-7 tracking-tight text-zinc-900">
            Developer Sandbox
          </h2>
        </div>
        <div className="mt-4 flex gap-2 p-2">
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Show
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50"
          >
            Hide
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-start gap-2">
        <div className="flex-grow">
          <TryCatchError />
        </div>
        <div className="flex-grow">
          <Backend500Error />
        </div>
        <div className="flex-grow">
          {/* TODO - replace with other types of errors */}
          <TryCatchError />
        </div>
      </div>
    </>
  );
}
1;
