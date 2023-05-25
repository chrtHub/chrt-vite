//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

//-- TSX Components --//
import { axiosErrorHandler } from "../Errors/axiosErrorHandler";
//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//

//-- Data Objects --//
import { AxiosError } from "axios";
interface IAnimal {
  type: string;
  url: string;
}

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {}
export default function NotFoundPage({}: IProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  //-- Randomly select an animal image to display --//
  const animals: IAnimal[] = [
    { type: "cat", url: "https://s3.amazonaws.com/chrt.com/catImage.jpeg" },
    { type: "dog", url: "https://s3.amazonaws.com/chrt.com/dogImage.jpeg" },
    { type: "puppy", url: "https://s3.amazonaws.com/chrt.com/puppyImage.jpeg" },
  ];
  let randomNumber: number = Math.floor(Math.random() * animals.length);
  let randomAnimal: IAnimal = animals[randomNumber];

  //-- Fetch image of randomAnimal from S3 bucket --//
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(randomAnimal.url, {
          responseType: "blob",
        });
        const imageBlob: Blob = await response.data;
        const imageURL: string = URL.createObjectURL(imageBlob);
        setImageSrc(imageURL);
        setImageLoaded(true);
      } catch (err) {
        if (err instanceof AxiosError) {
          axiosErrorHandler(err, "Cute Animal Photo Fetching");
        }
      }
    };
    fetchImage();
  }, []);

  return (
    <div className="min-h-full bg-zinc-50 px-6 py-16 dark:bg-zinc-950 sm:py-24  lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-bold tracking-tight text-green-600 sm:text-5xl">
            404
          </p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-zinc-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                Page not found :(
              </h1>
              <p className="mt-1 text-base font-semibold text-zinc-500">
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
            className="my-10 aspect-auto rounded-2xl" //-- 640x640 using current images --//
            src={imageSrc}
            alt={randomAnimal.type}
          />
        ) : (
          <div className="my-10 h-[300px] w-[300px] animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-950 md:h-[640px] md:w-[640px]"></div>
        )}
      </div>
    </div>
  );
}
