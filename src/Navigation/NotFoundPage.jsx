//-- react, react-router-dom, Auth0 --//
import { NavLink } from "react-router-dom";

//-- JSX Components --//

import catImage from "../Assets/page_not_found/catImage.jpg";
import dogImage from "../Assets/page_not_found/dogImage.jpg";
import puppyImage from "../Assets/page_not_found/puppyImage.jpg";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//

export default function NotFoundPage() {
  //-- Randomly select an animal image to display --//
  const animals = [
    { type: "cat", image: catImage },
    { type: "dog", image: dogImage },
    { type: "puppy", image: puppyImage },
  ];
  let randomNumber = Math.floor(Math.random() * animals.length);
  let randomAnimal = animals[randomNumber];

  return (
    <div className="min-h-full bg-white py-16 px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-bold tracking-tight text-green-600 sm:text-5xl">
            404
          </p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Page not found :(
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <NavLink
                to="/"
                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Go back home
              </NavLink>
            </div>
            <img
              className="aspect-auto"
              src={randomAnimal.image}
              alt={randomAnimal.type}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
