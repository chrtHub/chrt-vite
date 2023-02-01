//-- react, react-router-dom, Auth0 --//
import Auth0Profile from "../Auth/Auth0Profile"; // DEV

//-- JSX Components --//
import Hero from "./Hero/Hero";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function () {
  return (
    <>
      <Hero />
      <p className="text-center text-2xl text-gray-700">hello world</p>
      <Auth0Profile />
    </>
  );
}
