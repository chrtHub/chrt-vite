//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import JournalRoadmap from "./JournalRoadmap";
import ChrtGPTFutureRoadmap from "./ChrtGPTFutureRoadmap";
import ChrtGPTCurrentRoadmap from "./ChrtGPTCurrentRoadmap";
import { MapIcon } from "@heroicons/react/24/outline";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ComponentName() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-6 lg:pt-12">
      <div className="flex flex-row items-center justify-center gap-x-3 pb-3 text-3xl font-bold text-zinc-600 dark:text-zinc-200">
        Roadmap
        <MapIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-100" />
      </div>

      <div className="flex w-full flex-col justify-center gap-x-6 gap-y-6 rounded-lg bg-zinc-100 py-6 lg:flex-row">
        <ChrtGPTCurrentRoadmap />
        <JournalRoadmap />
      </div>

      {/* 3 */}
      <div className="flex w-full items-center justify-center">
        <ChrtGPTFutureRoadmap />
      </div>
    </div>
  );
}
