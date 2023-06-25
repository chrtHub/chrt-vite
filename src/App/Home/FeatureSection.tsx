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
    description:
      "Chat with OpenAI's latest LLMs, GPT-4 and GPT-3.5-Turbo (4k and 16k)",
    to: "/gpt",
    icon: ChatBubbleLeftRightIcon,
  },
];

export default function Example() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl rounded-lg bg-zinc-200 px-6 py-3 dark:bg-zinc-800 lg:px-8">
        <div className="mx-auto mb-3 max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Welcome to CHRT
          </h2>
          {/* Start of Line 1 */}
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-200">
            CHRT is currently in active development. Check out our running
            services below or view our{" "}
            <Link
              to="/roadmap"
              className="text-blue-700 underline dark:text-blue-400"
            >
              roadmap
            </Link>
            .
          </p>
          {/* End of Line 1 */}

          {/* Start of Line 2 */}
          <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-200">
            To download sample brokerage files, click{" "}
            <a
              href="https://drive.google.com/drive/folders/1SwhRXfl2RLggBW9-mU1orORdVIGnZKBj?usp=sharing"
              className="text-blue-700 underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
          {/* End of Line 2 */}
        </div>

        {/* Start of Services List */}
        <div className="mx-auto mt-6 max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600 dark:bg-zinc-500">
                    <service.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {service.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-200">
                  <p className="flex-auto">{service.description}</p>
                  <p className="mt-6">
                    <Link
                      to={service.to}
                      className="text-sm font-semibold leading-6 text-green-600"
                    >
                      Try it out <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {/* End of Services List */}
      </div>
    </div>
  );
}
