//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import GettingStartedSteps from "../App/Home/GettingStartedSteps";
import Roadmap from "../Roadmaps/Roadmaps";
import Footer from "./Hero/Footer";
import Hero from "./Hero/Hero";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {}
export default function ({}: IProps) {
  return (
    <>
      <div className="flex h-full flex-col">
        <Hero />

        <div className="px-6 lg:px-8">
          <GettingStartedSteps />
        </div>

        <div className="px-6 py-12 lg:px-8">
          <Roadmap />
        </div>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
}
