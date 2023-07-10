import { Link } from "react-router-dom";

import {
  ChartBarSquareIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const services = [
  {
    name: "Journal",
    description: "See analysis of your trading data",
    to: "/journal",
    icon: ChartBarSquareIcon,
  },
  {
    name: "Journal Files",
    description: "Upload your TD Ameritrade brokerage files",
    to: "/journal_files",
    icon: FolderIcon,
  },
  {
    name: "ChrtGPT",
    description: "Chat with OpenAI's latest LLMs, GPT-4 and GPT-3.5-Turbo",
    to: "/gpt",
    icon: ChatBubbleLeftRightIcon,
  },
];

export default function FeatureSection() {
  return (
    //-- pt instead of mt here prevents needless scrollable area --//
    <div className="pt-12">
      <div className="mx-auto max-w-7xl rounded-lg bg-zinc-100 px-6 py-3 dark:bg-zinc-800 lg:px-8">
        <div className="mx-auto mb-3 max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Welcome to CHRT
          </h2>
          {/* Start of Line 1 */}
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-200">
            CHRT is currently in active development.
          </p>
          {/* End of Line 1 */}

          {/* Start of Line 2 */}
          <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-200">
            Check out our running services below or view our{" "}
            <Link
              to="/roadmap"
              className="text-blue-700 underline dark:text-blue-400"
            >
              roadmap
            </Link>
            .
          </p>
          {/* End of Line 2 */}
        </div>

        {/* Start of Services List */}
        <div className="mx-auto mt-6 max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-3 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex flex-col rounded-lg bg-zinc-200 p-3 shadow-sm dark:bg-zinc-700"
              >
                {/* Start of Icon + Name */}
                <div className="flex flex-row items-center justify-start text-base font-semibold leading-7">
                  {/* Icon */}
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 dark:bg-green-800">
                    <service.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Name */}
                  <p className="flex items-center justify-start text-zinc-800 dark:text-zinc-50">
                    {service.name}
                  </p>
                </div>
                {/* End of Icon + Name */}

                <div className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-200">
                  {/* Decription */}
                  <p className="flex-auto">{service.description}</p>
                  {/* Button */}
                  <Link
                    to={service.to}
                    className="text-sm font-semibold leading-6"
                  >
                    <div className="mt-2 flex items-center justify-center rounded-md bg-green-600 py-2 text-white hover:bg-green-500 dark:bg-green-900 dark:hover:bg-green-800">
                      Try it out <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </dl>
        </div>
        {/* End of Services List */}
      </div>
    </div>
  );
}
