//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import GettingStartedSteps from "../App/Home/GettingStartedSteps";
import SignUpSteps from "../App/Home/SignUpSteps";
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
        <div className="">
          <Hero />
        </div>

        <SignUpSteps />
        <GettingStartedSteps />

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
}
