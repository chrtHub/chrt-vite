//-- react, react-router-dom, Auth0 --//

//-- JSX Components --//
import Footer from "./Hero/Footer";
import Hero from "./Hero/Hero";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function () {
  return (
    <div className="flex h-full flex-col bg-zinc-900/5">
      <div className="">
        <Hero />
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
