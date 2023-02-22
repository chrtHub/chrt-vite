import { useState, useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TypographyWrapper({ children }) {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setViewportHeight(window.innerHeight);
  //   };
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  return (
    <div className="flex justify-center">
      <div className="flex-column">
        <article
          className="lg:prose-md prose prose-zinc mt-8
  hover:prose-a:text-green-600 dark:prose-invert dark:hover:prose-a:text-green-600"
        >
          {children}
        </article>
        <div id="bottom-spacer" className="-mt-32 h-screen" />
      </div>
    </div>
  );
}
