import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

const { getAccessTokenSilently } = useAuth0();

const { showBoundary } = useErrorBoundary();

try {
  //-- Get access token from memory or request new token --//
  let accessToken = await getAccessTokenSilently();

  //-- Make GET request --//
  let res = await axios.get(`${VITE_ALB_BASE_URL}`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(res); // DEV
  //----//
} catch (err) {
  // console.log(err)
  // showBoundary(err)
}
