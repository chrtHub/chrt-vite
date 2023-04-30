//== react, react-router-dom, recoil, Auth0 ==//

//== TSX Components ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ChatLanding() {
  return (
    <div
      id="llm-sample-prompts"
      className="flex flex-grow flex-col items-center justify-center"
    >
      <p className="font-sans text-4xl font-semibold text-zinc-700 dark:text-zinc-200">
        ChrtGPT
      </p>
      <article className="prose prose-zinc dark:prose-invert">
        <div className="mb-0 flex flex-col">
          <p className="mb-0 mt-2.5 font-sans font-medium italic">
            What is ChrtGPT?
          </p>
          <p className="mb-0 mt-1.5 font-sans font-medium italic">
            How to be a good day trader?
          </p>
          <p className="mb-0 mt-1.5 font-sans font-medium italic">
            What are some risks of day trading?
          </p>
        </div>
      </article>
    </div>
  );
}