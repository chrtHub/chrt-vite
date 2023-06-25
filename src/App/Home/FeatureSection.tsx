import { Link } from "react-router-dom";

import {
  ChartBarSquareIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Journal Files",
    description: "Upload your TD Ameritrade brokerage files",
    to: "/journal_files",
    icon: FolderIcon,
  },
  {
    name: "Journal",
    description: "See analysis of your trading data.",
    to: "/journal",
    icon: ChartBarSquareIcon,
  },
  {
    name: "ChrtGPT",
    description:
      "Chat with OpenAI's latest LLMs, GPT-4 and GPT-3.5-Turbo (4k and 16k).",
    to: "/gpt",
    icon: ChatBubbleLeftRightIcon,
  },
];

export default function Example() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Welcome to CHRT
          </h2>
          {/* Start of Line 1 */}
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            CHRT is currently in active development. Check out our running
            services below or view our{" "}
            <Link to="/roadmap" className="text-blue-700 underline">
              roadmap
            </Link>
            .
          </p>
          {/* End of Line 1 */}
          {/* Start of Line 2 */}
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Before using a service, you'll need to submit some{" "}
            <Link
              to="/account/data_privacy"
              className="text-blue-700 underline"
            >
              agreements
            </Link>{" "}
            and sign up for our{" "}
            <Link
              to="/account/subscriptions"
              className="text-blue-700 underline"
            >
              free trial
            </Link>
            .
          </p>
          {/* End of Line 1 */}
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-zinc-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link
                      to={feature.to}
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
      </div>
    </div>
  );
}
