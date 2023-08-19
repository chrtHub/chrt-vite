//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import JournalRoadmap from "./JournalRoadmap";
import ChrtGPTFutureRoadmap from "./ChrtGPTFutureRoadmap";
import ChrtGPTCurrentRoadmap from "./ChrtGPTCurrentRoadmap";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import { format } from "date-fns";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Roadmaps() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  const currentDate = format(new Date(), "MMM d, yyyy");
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full w-full flex-col items-center justify-start">
      <div className="w-full rounded-lg bg-zinc-200 dark:bg-zinc-700">
        {/* TITLE */}
        <div className="flex flex-row items-center justify-center gap-x-3 py-3 text-3xl font-bold text-zinc-700 dark:text-zinc-100">
          CHRT Product Roadmap (as of {currentDate})
        </div>

        {/* ChrtGPT and CHRT Journal ROADMAPS */}
        <div className="mx-3 mb-3 flex flex-col justify-center gap-x-6 gap-y-6 rounded-lg bg-zinc-100 py-6 dark:bg-zinc-800 lg:flex-row">
          <ChrtGPTCurrentRoadmap />
          <JournalRoadmap />
        </div>

        {/* ChrtGPT + Journal ROADMAP */}
        <div className="mx-3 my-3 flex items-center justify-center rounded-lg bg-zinc-100 py-6 dark:bg-zinc-800">
          <ChrtGPTFutureRoadmap />
        </div>
      </div>
    </div>
  );
}
