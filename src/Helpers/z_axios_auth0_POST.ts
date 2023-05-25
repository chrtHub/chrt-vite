import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

import { axiosErrorHandler } from "../Errors/axiosErrorHandler";

import axios, { AxiosError } from "axios";

let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

const { getAccessTokenSilently } = useAuth0();

const { showBoundary } = useErrorBoundary();

try {
  //-- Get access token from memory or request new token --//
  let accessToken = await getAccessTokenSilently();

  //-- Make POST request --//
  let res = await axios.post(
    `${VITE_ALB_BASE_URL}`,
    //-- Body Content --//
    {
      key1: "value1",
      key2: "value2",
    },
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log(res); // DEV
  //----//
} catch (err) {
  console.log(err);
  // showBoundary(err)
  if (err instanceof AxiosError) {
    axiosErrorHandler(err, "");
  }
}
