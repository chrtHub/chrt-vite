//== react, react-router-dom, Auth0 ==//
import { useState, useEffect } from "react";

//== TSX Components, Functions ==//
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useJournalContext } from "../../../Context/JournalContext";

//== NPM Components ==//
import { Combobox } from "@headlessui/react";
import { Switch } from "@headlessui/react";

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
  const [comboboxQuery, setComboboxQuery] = useState("");
  const [chrtLayoutsEnabled, setCHRTLayoutsEnabled] = useState(true);
  const [customLayoutsEnabled, setCustomLayoutsEnabled] = useState(true);
  const [filteredLayoutsOptions, setFilteredLayoutsOptions] = useState(
    JC.layoutsOptions
  );

  //== Auth ==//

  //== Other ==//
  const md = useMediaQuery(`(min-width: ${breakpoints.md})`);

  const getFilteredOptions = () => {
    let filteredOptions = JC.layoutsOptions;
    //-- Filter by combobox query--//
    if (comboboxQuery !== "") {
      filteredOptions = filteredOptions.filter((layoutsOption) =>
        layoutsOption.name.toLowerCase().includes(comboboxQuery.toLowerCase())
      );
    }
    //-- Filter by 'chrtLayoutsEnabled'--//
    if (!chrtLayoutsEnabled) {
      filteredOptions = filteredOptions.filter(
        (layoutsOption) => layoutsOption.author !== "chrt"
      );
    }
    //-- Filter by 'customLayoutsEnabled'--//
    if (!customLayoutsEnabled) {
      filteredOptions = filteredOptions.filter(
        (layoutsOption) => layoutsOption.author === "chrt"
      );
    }
    return filteredOptions;
  };

  //== Side Effects ==//
  useEffect(() => {
    let filteredOptions = getFilteredOptions();
    if (filteredOptions) {
      setFilteredLayoutsOptions(filteredOptions);
    }
  }, [comboboxQuery, chrtLayoutsEnabled, customLayoutsEnabled]);

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full flex-col items-center justify-start rounded-lg dark:bg-zinc-800 dark:text-zinc-200">
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
      {/* START OF LAYOUTS OPTIONS COMBOBOX */}
      <Combobox
        as="div"
        value={JC.currentLayoutsOption}
        onChange={JC.setCurrentLayoutsOption}
        className="w-full"
      >
        <Combobox.Label className="text-sm font-medium leading-6 text-zinc-900">
          Layouts
        </Combobox.Label>
        <div className="relative">
          <Combobox.Input
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            onChange={(event) => setComboboxQuery(event.target.value)}
            displayValue={(layoutsOption: ILayoutsOption) => layoutsOption.name}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-zinc-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredLayoutsOptions?.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredLayoutsOptions.map((layoutsOption) => (
                <Combobox.Option
                  key={layoutsOption.name}
                  value={layoutsOption}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-8 pr-4",
                      active ? "bg-green-600 text-white" : "text-zinc-900"
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
      {/* END OF LAYOUTS OPTIONS COMBOBOX */}

      {/* START OF TOGGLES */}
      <div className="mt-2 flex flex-row">
        {/* START OF CHRT LAYOUTS TOGGLE */}
        <div className="flex w-full flex-row gap-x-1.5">
          <div className="flex flex-col items-center justify-center">
            <Switch
              checked={chrtLayoutsEnabled}
              onChange={setCHRTLayoutsEnabled}
              className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-full w-full rounded-md bg-white"
              />
              <span
                aria-hidden="true"
                className={classNames(
                  chrtLayoutsEnabled ? "bg-green-600" : "bg-gray-200",
                  "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                )}
              />
              <span
                aria-hidden="true"
                className={classNames(
                  chrtLayoutsEnabled ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
          <p className="text-sm font-medium">CHRT Layouts</p>
        </div>
        {/* END OF CHRT LAYOUTS TOGGLE */}

        {/* START OF CUSTOM LAYOUTS TOGGLE */}
        <div className="flex w-full flex-row gap-x-1.5">
          <div className="flex flex-col items-center justify-center">
            <Switch
              checked={customLayoutsEnabled}
              onChange={setCustomLayoutsEnabled}
              className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-full w-full rounded-md bg-white"
              />
              <span
                aria-hidden="true"
                className={classNames(
                  customLayoutsEnabled ? "bg-green-600" : "bg-gray-200",
                  "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                )}
              />
              <span
                aria-hidden="true"
                className={classNames(
                  customLayoutsEnabled ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
          <p className="break-words text-sm font-medium">Custom Layouts</p>
        </div>
        {/* END OF CUSTOM LAYOUTS TOGGLE */}
      </div>
      {/* END OF TOGGLES */}
    </div>
  );
}
