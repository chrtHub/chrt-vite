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
import { BsCloudCheck as CloudCheckReactIcon } from "react-icons/bs";

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
    <div className="flex h-full flex-col items-center justify-start rounded-lg dark:text-zinc-200">
      {/* START OF SAVE LAYOUT */}
      {/* <div className="w-full">
        {JC.unsavedLayoutsChanges ? (
          <button
            onClick={() => {
              console.log("TODO save layout");
            }}
            className={classNames(
              "flex w-full flex-row items-center justify-center gap-x-1.5 rounded-full py-1.5 text-sm",
              "bg-orange-200 text-orange-800 hover:bg-orange-300 hover:text-orange-900",
              "dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800 dark:hover:text-orange-100"
            )}
          >
            <p className="">Click to Save Changes</p>
            <CloudArrowUpIcon className="h-5 w-5" />
          </button>
        ) : (
          <div
            className={classNames(
              "flex w-full cursor-not-allowed flex-row items-center justify-center gap-x-1.5 rounded-full py-1.5 text-sm",
              "bg-sky-300 text-sky-800 ",
              "dark:bg-sky-700 dark:text-sky-200"
            )}
          >
            <p className="font-semibold">Saved to Cloud</p>
            <CloudCheckReactIcon className="h-5 w-5" />
          </div>
        )}
      </div> */}
      {/* END OF SAVE LAYOUT */}

      {/* START OF NARROW MODE */}
      {!md && (
        <div className="mt-1.5 flex w-full items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
          <p className="font-bold text-zinc-700 dark:text-zinc-200">
            Narrow Mode Layout
          </p>
        </div>
      )}
      {/* END OF NARROW MODE */}

      {/* START OF CURRENT LAYOUT NAME */}
      <div className="mt-2 flex w-full justify-start">
        <p className="text-zinc-500 dark:text-zinc-300">
          Current Layout:{" "}
          <span className="text-zinc-800 dark:text-zinc-100">
            {JC.currentLayoutsOption.name}
          </span>
        </p>
      </div>
      {/* END OF CURRENT LAYOUT NAME */}

      {/* START OF LAYOUTS OPTIONS COMBOBOX */}
      <Combobox
        as="div"
        value={JC.currentLayoutsOption}
        onChange={JC.setCurrentLayoutsOption}
        className="mt-2 w-full"
      >
        <Combobox.Label className="text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-200">
          Layouts
        </Combobox.Label>
        <div className="relative">
          <Combobox.Input
            className={classNames(
              "w-full rounded-md border-0  py-1.5 pl-3 pr-10 text-zinc-900 shadow-sm sm:text-sm sm:leading-6",
              "ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-green-600",
              "ring-zinc-300",
              "dark:ring-zinc-700",
              "bg-white",
              "dark:bg-zinc-800 dark:text-zinc-100"
            )}
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
            <Combobox.Options
              className={classNames(
                "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg focus:outline-none sm:text-sm",
                "ring-1 ring-black ring-opacity-5",
                "bg-white",
                "dark:bg-zinc-800"
              )}
            >
              {filteredLayoutsOptions.map((layoutsOption) => (
                <Combobox.Option
                  key={layoutsOption.name}
                  value={layoutsOption}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-8 pr-4",
                      active
                        ? "bg-green-600 text-white dark:bg-green-700"
                        : "text-zinc-900 dark:text-zinc-100"
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
                            active
                              ? "text-white"
                              : "text-green-600 dark:text-green-400"
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
        {/* <div className="flex w-full flex-row gap-x-1.5">
          <div className="flex flex-col items-center justify-center">
            <Switch
              checked={chrtLayoutsEnabled}
              onChange={setCHRTLayoutsEnabled}
              className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-full w-full rounded-md"
              />

              <span
                //-- Toggle Slide Area --//
                aria-hidden="true"
                className={classNames(
                  chrtLayoutsEnabled ? "bg-green-600" : "bg-zinc-200",
                  "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                )}
              />

              <span
                //-- Toggle Knob --//
                aria-hidden="true"
                className={classNames(
                  chrtLayoutsEnabled ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-zinc-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
          <p className="text-sm font-medium">CHRT Layouts</p>
        </div> */}
        {/* END OF CHRT LAYOUTS TOGGLE */}

        {/* START OF CUSTOM LAYOUTS TOGGLE */}
        {/* <div className="flex w-full flex-row gap-x-1.5">
          <div className="flex flex-col items-center justify-center">
            <Switch
              checked={customLayoutsEnabled}
              onChange={setCustomLayoutsEnabled}
              className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-full w-full rounded-md"
              />
              <span
                //-- Toggle Slide Area --//
                aria-hidden="true"
                className={classNames(
                  customLayoutsEnabled ? "bg-green-600" : "bg-zinc-200",
                  "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                )}
              />
              <span
                //-- Toggle Knob --//
                aria-hidden="true"
                className={classNames(
                  customLayoutsEnabled ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-zinc-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
          <p className="break-words text-sm font-medium">Custom Layouts</p>
        </div> */}
        {/* END OF CUSTOM LAYOUTS TOGGLE */}
      </div>
      {/* END OF TOGGLES */}
    </div>
  );
}
