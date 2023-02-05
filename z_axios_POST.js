//-- ***** ***** ***** POST request ***** ***** ***** --//

import axios from "axios";

const { getAccessTokenSilently } = useAuth0();

try {
  //-- Get access token from memory or request new token --//
  let accessToken = await getAccessTokenSilently();

  //-- Make POST request --//
  let res = await axios.post(
    "https://alb.chrt.com",
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
}
