import { useState } from "react";
import InvokeErrors from "./InvokeErrors";

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function DevSandbox() {
  const DEV_MODE_BOOLEAN = import.meta.env.DEV;
  const [showSandbox, setShowSandbox] = useState(DEV_MODE_BOOLEAN);

  return (
    <div>
      {/* Section Title and Show/Hide Buttons */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-semibold leading-7 tracking-tight text-zinc-900 dark:text-zinc-200">
            Developer Sandbox
          </h2>
        </div>
        <div className="mt-4 flex gap-2 p-2">
          <button
            type="button"
            onClick={() => {
              setShowSandbox(true);
            }}
            className="ml-3 inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Show
          </button>
          <button
            type="button"
            onClick={() => setShowSandbox(false)}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50"
          >
            Hide
          </button>
        </div>
      </div>

      {/* Content Section(s) */}
      <div className="flex flex-col items-center">
        {showSandbox && <InvokeErrors />}
      </div>
    </div>
  );
}
1;
