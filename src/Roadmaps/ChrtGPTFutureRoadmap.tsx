//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//

//== NPM Components ==//

//== Icons ==//
import { CheckIcon } from "@heroicons/react/20/solid";

//== NPM Functions ==//

//== Utility Functions ==//
import classNames from "../Util/classNames";
import { MapIcon } from "@heroicons/react/24/outline";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

interface ISteps {
  name: string;
  description: string;
  description2?: string;
  status: "complete" | "current" | "upcoming";
}
const steps: ISteps[] = [
  {
    name: "ChrtGPT as a tool for analyzing trading data",
    description: "Ask an LLM questions about your own data",
    description2: "and receive text-based responses",
    status: "upcoming",
  },
  {
    name: "Charts as responses",
    description: "Receive charts as conversation responses",
    status: "upcoming",
  },
];

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ChrtGPTFutureRoadmap() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* TITLE */}
      <div className="mb-5 flex flex-row items-center justify-center gap-x-2">
        <p className="text-2xl font-bold text-zinc-700 dark:text-zinc-100">
          ChrtGPT + Journal
        </p>
        {/* <MapIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-100" /> */}
      </div>

      {/* STEPS */}
      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={classNames(
                stepIdx !== steps.length - 1 ? "pb-10" : "",
                "relative"
              )}
            >
              {step.status === "complete" ? (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-green-600"
                      aria-hidden="true"
                    />
                  ) : null}
                  <a className="group relative flex items-start">
                    <span className="flex h-9 items-center">
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                        <CheckIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {step.name}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-300">
                        {step.description}
                        <br />
                        {step?.description2}
                      </span>
                    </span>
                  </a>
                </>
              ) : step.status === "current" ? (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-zinc-300 dark:bg-zinc-500"
                      aria-hidden="true"
                    />
                  ) : null}
                  <a
                    className="group relative flex items-start"
                    aria-current="step"
                  >
                    <span className="flex h-9 items-center" aria-hidden="true">
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 bg-white dark:bg-green-200">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-green-600">
                        {step.name}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-300">
                        {step.description}
                        <br />
                        {step?.description2}
                      </span>
                    </span>
                  </a>
                </>
              ) : (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-zinc-300 dark:bg-zinc-500"
                      aria-hidden="true"
                    />
                  ) : null}
                  <a className="group relative flex items-start">
                    <span className="flex h-9 items-center" aria-hidden="true">
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-50">
                        {step.name}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-300">
                        {step.description}
                        <br />
                        {step?.description2}
                      </span>
                    </span>
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
