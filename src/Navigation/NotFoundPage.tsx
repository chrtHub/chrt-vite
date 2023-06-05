//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

//-- TSX Components --//
import { axiosErrorToaster } from "../Errors/axiosErrorToaster";
//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//

//-- Data Objects --//
import { AxiosError } from "axios";
import classNames from "../Util/classNames";
import { DARK_THEME_BG, LIGHT_THEME_BG } from "../Layout/Theme";
import { throwAxiosError } from "../Errors/throwAxiosError";

//-- Styles, animals, emotions --//
let styles = [
  "claymation",
  "award winning 4K photography",
  "flat art",
  "geometric",
  "anime",
  "minimalism",
  "3D illustration",
  "futurism",
  "synthwave",
  "vector",
];
let animals = [
  "dog",
  "cat",
  "squirrel",
  "cow",
  "koala bear",
  "penguin",
  "sloth",
];
let emotions = [
  "sad",
  "perplexed",
  "confused",
  "disappointed",
  "frustrated",
  "furious",
  "irritated",
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {}
export default function NotFoundPage({}: IProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  //-- Select random style, animal, and emotion --//
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const [style, setStyle] = useState<string>(randomStyle);
  const [animal, setAnimal] = useState<string>(randomAnimal);
  const [emotion, setEmotion] = useState<string>(randomEmotion);

  //-- Shim to hyphenate "award-winning" --//
  const [displayedStyle, setDisplayedStyle] = useState<string>(style);
  if (style === "award winning 4K photography") {
    setDisplayedStyle("award-winning 4k photography");
    console.log(displayedStyle); // DEV
  }

  //-- Fetch image of randomAnimal from S3 bucket --//
  useEffect(() => {
    console.log(style, animal, emotion);
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `https://s3.amazonaws.com/sad-animal-404-images/${style}/${animal}/${emotion}`,
          {
            responseType: "blob",
          }
        );
        const imageBlob: Blob = await response.data;
        const imageURL: string = URL.createObjectURL(imageBlob);
        setImageSrc(imageURL);
        setImageLoaded(true);
      } catch (err) {}
    };
    fetchImage();
  }, [style, animal, emotion]);

  return (
    <div
      className={classNames(
        `${LIGHT_THEME_BG} ${DARK_THEME_BG}`,
        "min-h-full px-6 py-16 sm:py-24 lg:px-8"
      )}
    >
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-bold tracking-tight text-green-600 lg:text-5xl">
            404
          </p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-zinc-200 sm:pl-6">
              <h1 className="text-4xl  font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                Page not found :(
              </h1>
              <p className="mt-1 text-base font-semibold text-zinc-500">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="mt-2 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6 lg:mt-10">
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
          <>
            <img
              className="my-4 mb-3 aspect-square w-full rounded-2xl lg:mt-10"
              src={imageSrc}
              alt={`${emotion} ${animal}, ${displayedStyle}`}
            />
            <p className="font-mono text-lg font-semibold text-zinc-500 dark:text-zinc-300">
              {emotion} {animal}, {displayedStyle}
            </p>
          </>
        ) : (
          <div className="my-4 flex aspect-square w-full animate-pulse flex-col items-center justify-center rounded-2xl bg-zinc-300 text-center dark:bg-zinc-800 lg:mt-10 lg:h-[512px] lg:w-[512px]">
            <p className="text-2xl font-semibold text-zinc-600 dark:text-zinc-300">
              Getting AI-generated
              <br />
              animal image...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
