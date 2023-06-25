//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import JournalRoadmap from "./JournalRoadmap";
import ChrtGPTRoadmap from "./ChrtGPTRoadmap";
import ChrtRoadmap from "./ChrtRoadmap";
import LLMChatRoadmap from "./LLMChart";

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
      {/* 1 */}
      <div className="flex w-full items-center justify-center">
        <ChrtRoadmap />
      </div>
      {/* 2a */}
      <div className="flex w-full flex-row items-center justify-center">
        <LLMChatRoadmap />

        {/* 2b */}
        <JournalRoadmap />
      </div>

      {/* 3 */}
      <div className="flex w-full items-center justify-center">
        <ChrtGPTRoadmap />
      </div>
    </div>
  );
}
