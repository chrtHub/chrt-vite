//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import JournalRoadmap from "./JournalRoadmap";
import ChrtGPTFutureRoadmap from "./ChrtGPTFutureRoadmap";
import ChrtGPTCurrentRoadmap from "./ChrtGPTCurrentRoadmap";
import { MapIcon } from "@heroicons/react/24/outline";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import { format } from "date-fns";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function Roadmap() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  const currentDate = format(new Date(), "MMM d, yyyy");
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full w-full flex-col items-center justify-start py-6">
      <div className="flex flex-row items-center justify-center gap-x-3 pb-3 text-3xl font-bold text-zinc-600 dark:text-zinc-200">
        CHRT Product Roadmap (as of {currentDate})
      </div>

      <div className="flex w-full flex-col justify-center gap-x-6 gap-y-6 rounded-lg bg-zinc-100 py-6 dark:bg-zinc-800 lg:flex-row">
        <ChrtGPTCurrentRoadmap />
        <JournalRoadmap />
      </div>

      {/* 3 */}
      <div className="flex w-full items-center justify-center">
        <ChrtGPTFutureRoadmap />
      </div>
      <div className="mb-12 h-12 bg-blue-200" />
    </div>
  );
}
