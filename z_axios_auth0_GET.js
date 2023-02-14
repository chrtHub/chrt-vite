//-- ***** ***** ***** GET request ***** ***** ***** --//

import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const { getAccessTokenSilently } = useAuth0();

try {
  //-- Get access token from memory or request new token --//
  let accessToken = await getAccessTokenSilently();

  //-- Make GET request --//
  let res = await axios.get("https://alb.chrt.com", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(res); // DEV
  //----//
} catch (err) {
  console.log(err);
}
