//== react, react-router-dom, Auth0 ==//
import { useState } from "react";

//== TSX Components, Functions ==//
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useJournalContext } from "../../../Context/JournalContext";

//== NPM Components ==//
import { Combobox } from "@headlessui/react";

//== Icons ==//
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { BsCloudCheck } from "react-icons/bs";

//== NPM Functions ==//
import { useMediaQuery } from "usehooks-ts";

//== Utility Functions ==//
import classNames from "../../../Util/classNames";
import { ILayoutsOption } from "../Types/journal_types";
import { breakpoints } from "../../../Util/TailwindBreakpoints";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Layouts() {
  //== React State, Custom Hooks ==//
  let JC = useJournalContext();
  const [query, setQuery] = useState("");

  //== Auth ==//
  //== Other ==//
  const md = useMediaQuery(`(min-width: ${breakpoints.md})`);

  const filteredLayoutsOptions =
    query === ""
      ? JC.layoutsOptions
      : JC.layoutsOptions.filter((layoutsOptions) => {
          return layoutsOptions.name
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full flex-col items-center justify-start rounded-lg bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200">
      {/* Narrow mode? */}
      {!md ? <p>narrow mode</p> : <p>not narrow mode</p>}

      <div className="mb-8 rounded-lg bg-zinc-700 p-6">
        {/* Saves / Unsaved Layouts */}
        {JC.unsavedLayoutsChanges ? (
          <>
            <p className="dark:text-zinc-200">unsaved changes</p>
            <p className="dark:text-zinc-200">click to save</p>
            <CloudArrowUpIcon className="h-6 w-6 dark:text-zinc-200" />
          </>
        ) : (
          <>
            <p className="dark:text-zinc-200">saved</p>
            <BsCloudCheck className="h-6 w-6 dark:text-zinc-200" />
          </>
        )}
      </div>

      {/* Layouts Options Combobox */}
      <Combobox
        as="div"
        value={JC.currentLayoutsOption}
        onChange={JC.setCurrentLayoutsOption}
      >
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          Layout
        </Combobox.Label>
        <div className="relative mt-2">
          <Combobox.Input
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(layoutsOption) => layoutsOption?.name} // DEV fix this
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredLayoutsOptions.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredLayoutsOptions.map((layoutsOption) => (
                <Combobox.Option
                  key={layoutsOption.name}
                  value={layoutsOption}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-8 pr-4",
                      active ? "bg-green-600 text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          "block truncate",
                          selected ? "font-semibold" : ""
                        )}
                      >
                        {layoutsOption.name}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 left-0 flex items-center pl-1.5",
                            active ? "text-white" : "text-green-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
}
