//== react, react-router-dom, Auth0 ==//
import { Link } from "react-router-dom";

//== TSX Components, Functions ==//

//== NPM Components ==//
import ReactPlayer from "react-player";

//== Icons ==//
import {
  ChartBarSquareIcon,
  FolderIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

{
  /* <Link to="/roadmap" className="text-blue-700 underline dark:text-blue-400">
  roadmap
</Link> */
}

export default function GettingStartedSteps() {
  return (
    //-- pt instead of mt here prevents needless scrollable area --//

    <div className="my-2 rounded-lg bg-zinc-200 p-3 dark:bg-zinc-700">
      <h1 className="text-center text-2xl font-bold text-zinc-700 dark:text-zinc-50 sm:text-3xl">
        Getting started with CHRT
      </h1>
      {/* Start of Steps List */}
      <div className="mx-auto mt-3 max-w-2xl lg:max-w-none">
        <dl className="mb-3 grid max-w-xl grid-cols-1 gap-x-3 gap-y-3 lg:max-w-none lg:grid-cols-4 lg:gap-y-3">
          {/* START OF STEP 1 */}
          <div className="flex flex-col rounded-lg bg-zinc-100 p-4 shadow-sm dark:bg-zinc-800">
            {/* Start of Icon + Name */}
            <div className="flex flex-row items-center justify-start text-base font-semibold leading-7">
              {/* Icon */}
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 dark:bg-green-800">
                <FolderIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>

              {/* Name */}
              <p className="flex items-center justify-start text-zinc-800 dark:text-zinc-50">
                Journal Files
              </p>
            </div>
            {/* End of Icon + Name */}

            <div className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-200">
              {/* Description */}
              <p className="flex-auto">
                Upload brokerage files from TD Ameritrade (or use our example
                files)
              </p>
            </div>
          </div>
          {/* END OF STEP 1 */}

          {/* START OF STEP 2 */}
          <div className="flex flex-col rounded-lg bg-zinc-100 p-4 shadow-sm dark:bg-zinc-800">
            {/* Start of Icon + Name */}
            <div className="flex flex-row items-center justify-start text-base font-semibold leading-7">
              {/* Icon */}
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 dark:bg-green-800">
                <ChartBarSquareIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>

              {/* Name */}
              <p className="flex items-center justify-start text-zinc-800 dark:text-zinc-50">
                Journal
              </p>
            </div>
            {/* End of Icon + Name */}

            <div className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-200">
              {/* Description */}
              <p className="flex-auto">
                See analysis of your trading performance
              </p>
            </div>
          </div>
          {/* END OF STEP 2 */}

          {/* START OF STEP 3 */}
          <div className="flex flex-col rounded-lg bg-zinc-100 p-4 shadow-sm dark:bg-zinc-800">
            {/* Start of Icon + Name */}
            <div className="flex flex-row items-center justify-start text-base font-semibold leading-7">
              {/* Icon */}
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 dark:bg-green-800">
                <ChatBubbleLeftRightIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>

              {/* Name */}
              <p className="flex items-center justify-start text-zinc-800 dark:text-zinc-50">
                ChrtGPT
              </p>
            </div>
            {/* End of Icon + Name */}

            <div className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-200">
              {/* Description */}
              <p className="flex-auto">Chat with GPT-3.5 and GPT-4</p>
            </div>
          </div>
          {/* END OF STEP 3 */}

          {/* START OF STEP 4 */}
          <div className="flex flex-col rounded-lg bg-zinc-100 p-4 shadow-sm dark:bg-zinc-800">
            {/* Start of Icon + Name */}
            <div className="flex flex-row items-center justify-start text-base font-semibold leading-7">
              {/* Icon */}
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 dark:bg-green-800">
                <MapIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>

              {/* Name */}
              <p className="flex items-center justify-start text-zinc-800 dark:text-zinc-50">
                Product Roadmap
              </p>
            </div>
            {/* End of Icon + Name */}

            <div className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-200">
              {/* Description */}
              <p className="flex-auto">See the future of CHRT.com</p>
            </div>
          </div>
          {/* END OF STEP 4 */}
        </dl>
      </div>
      {/* End of Steps List */}

      {/* START OF GETTING STARTED VIDEO  */}
      <div className="flex aspect-video flex-row items-center justify-center">
        <ReactPlayer
          url="https://youtu.be/GXNyadBRp-g"
          width="100%"
          height="100%"
        />
      </div>
      {/* END OF GETTING STARTED VIDEO  */}
    </div>
  );
}

{
  /* <Link to={service.to} className="text-sm font-semibold leading-6">
  <div className="mt-2 flex items-center justify-center rounded-md bg-green-600 py-2 text-white hover:bg-green-500 dark:bg-green-900 dark:hover:bg-green-800">
    Try it out <span aria-hidden="true">→</span>
  </div>
</Link> */
}
