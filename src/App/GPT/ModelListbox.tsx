//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect, Fragment } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//

//-- NPM Components --//
import { Listbox, Transition } from "@headlessui/react";

//-- Icons --//
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
import { fooState } from "./atoms";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Types --//

// DEV - name these per the OpenAI SDK model canonical names
interface IModel {
  friendlyName: string;
  description: string;
  deprecation?: Date;
}
const currentModels: Record<string, IModel> = {
  "gpt-3.5-turbo": {
    friendlyName: "GPT-3.5 Turbo",
    description: "Power and Speed",
  },
  "gpt-4": {
    friendlyName: "GPT-4",
    description: "Extra power, but slower",
  },
};

const staticModels: Record<string, IModel> = {
  "gpt-4-0314": {
    friendlyName: "GPT-4, March 14",
    description: "Extra power, but slower",
    deprecation: new Date("June 14, 2023"),
  },
  "gpt-4-32k-0314": {
    friendlyName: "GPT-4-32k, March 14",
    description: "The large prompts version",
    deprecation: new Date("June 14, 2023"),
  },
  "gpt-3.5-turbo-0301": {
    friendlyName: "GPT-3.5 Turbo, March 1",
    description: "Power and Speed",
    deprecation: new Date("June 1, 2023"),
  },
};

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ModelListbox() {
  //-- React State --//
  const [selectedModel, setSelectedModel] = useState<IModel>(
    currentModels["gpt-3.5-turbo"]
  );

  //-- Recoil State --//
  const [bar, setBar] = useRecoilState(fooState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  //-- ***** ***** ***** Subcomponents ***** ***** ***** --//
  const modelsOptions = (modelsList: Record<string, IModel>) => {
    return (
      <>
        {Object.entries(modelsList).map((record) => (
          <Listbox.Option
            key={record[0]}
            className={({ active }) =>
              classNames(
                active ? "bg-green-600 text-white" : "text-zinc-900",
                "relative cursor-default select-none py-2 pl-3 pr-9"
              )
            }
            value={record[0]}
          >
            {({ selected, active }) => (
              <>
                <div className="flex">
                  <span
                    className={classNames(
                      selected ? "font-semibold" : "font-normal",
                      "truncate"
                    )}
                  >
                    {record[1].friendlyName}
                  </span>
                  <span
                    className={classNames(
                      active ? "text-green-200" : "text-zinc-500",
                      "ml-2 truncate"
                    )}
                  >
                    {record[1].description}
                  </span>
                </div>

                {selected ? (
                  <span
                    className={classNames(
                      active ? "text-white" : "text-green-600",
                      "absolute inset-y-0 right-0 flex items-center pr-4"
                    )}
                  >
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </>
            )}
          </Listbox.Option>
        ))}
      </>
    );
  };

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <>
      <Listbox value={selectedModel} onChange={setSelectedModel}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-zinc-900">
              Select a model
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm sm:leading-6">
                <span className="inline-flex w-full truncate">
                  <span className="truncate">{selectedModel.friendlyName}</span>
                  <span className="ml-2 truncate text-zinc-500">
                    {selectedModel.description}
                  </span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-zinc-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {modelsOptions(currentModels)}
                  {modelsOptions(staticModels)}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </>
  );
}
