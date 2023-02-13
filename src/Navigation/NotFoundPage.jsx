//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//

export default function NotFoundPage() {
  const [imageSrc, setImageSrc] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);

  //-- Randomly select an animal image to display --//
  const animals = [
    { type: "cat", url: "https://s3.amazonaws.com/chrt.com/catImage.jpeg" },
    { type: "dog", url: "https://s3.amazonaws.com/chrt.com/dogImage.jpeg" },
    { type: "puppy", url: "https://s3.amazonaws.com/chrt.com/puppyImage.jpeg" },
  ];
  let randomNumber = Math.floor(Math.random() * animals.length);
  let randomAnimal = animals[randomNumber];

  //-- Fetch image of randomAnimal from S3 bucket --//
  useEffect(() => {
    const fetchImage = async () => {
      const response = await axios.get(randomAnimal.url, {
        responseType: "blob",
      });
      const imageBlob = await response.data;
      const imageURL = URL.createObjectURL(imageBlob);
      setImageSrc(imageURL);
      setImageLoaded(true);
    };
    fetchImage();
  }, []);

  return (
    <div className="min-h-full bg-zinc-100 py-16 px-6 sm:py-24  lg:px-8">
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
          </div>
        </main>
        {imageLoaded ? (
          <img
            className="my-10 aspect-auto" //-- 640x640 using current images --//
            src={imageSrc}
            alt={randomAnimal.type}
          />
        ) : (
          <div
            className={`my-10 h-[300px] w-[300px] animate-pulse bg-zinc-200 md:h-[640px] md:w-[640px]`}
          ></div>
        )}
      </div>
    </div>
  );
}
