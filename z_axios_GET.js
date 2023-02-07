//-- ***** ***** ***** GET request ***** ***** ***** --//

import axios from "axios";

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
