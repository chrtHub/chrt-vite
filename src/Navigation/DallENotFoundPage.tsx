//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";

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
interface IAnimal {
  type: string;
  url: string;
}
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
interface IProps {}
export default function DallENotFoundPage({}: IProps) {
  const [animal, setAnimal] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);

  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const { getAccessTokenSilently, user } = useAuth0();

  //-- Fetch OpenAI-generated Image --//
  useEffect(() => {
    const fetchOpenAIImage = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response1 = await axios.post(
          `${VITE_ALB_BASE_URL}/openai/create_image`,
          //-- Body Content --//
          {},
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        //-- Set Image Caption --//
        setAnimal(response1.data.animal);
        setEmotion(response1.data.emotion);
        setStyle(response1.data.style);

        //-- Image Data --//
        const base64JSON = response1.data.base64JSON;
        setImageSrc(`data:image/png;base64,${base64JSON}`);
        setImageLoaded(true);
      } catch (err) {
        if (err instanceof AxiosError) {
          axiosErrorToaster(err, "Sad Animal Image Generation");
        }
      }
    };
    fetchOpenAIImage();
  }, []);

  return (
    <div
      className={classNames(
        `${LIGHT_THEME_BG} ${DARK_THEME_BG}`,
        "min-h-full px-6 py-16 sm:py-24 lg:px-8"
      )}
    >
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
          <>
            <img
              className="mb-3 mt-10 aspect-auto rounded-2xl" //-- 640x640 using current images --//
              src={imageSrc}
              alt={"sad animal image"}
            />
            <p className="font-mono text-lg font-semibold text-zinc-500 dark:text-zinc-300">
              {emotion} {animal}, {style}
            </p>
          </>
        ) : (
          <div className="mb-3 mt-10 flex h-[300px] w-[300px] animate-pulse flex-col items-center justify-center rounded-2xl bg-zinc-300 dark:bg-zinc-800 md:h-[512px] md:w-[512px]">
            <p className="text-2xl font-semibold text-zinc-600 dark:text-zinc-300">
              Generating sad animal image...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
