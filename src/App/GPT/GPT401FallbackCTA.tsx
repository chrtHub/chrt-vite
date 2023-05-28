export const GPT401FallbackCTA = () => {
  return (
    <div className="flex w-full flex-grow flex-row justify-center">
      <div className="flex w-full max-w-prose flex-col justify-center rounded-lg bg-zinc-200 text-center dark:bg-zinc-800">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Start using ChrtGPT today
          {/* <br /> */}
          {/* today */}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Request free access to the preview release
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Get Access <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};
