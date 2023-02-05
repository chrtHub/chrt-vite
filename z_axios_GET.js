//-- ***** ***** ***** GET request ***** ***** ***** --//

import axios from "axios";

//-- Request parameters --//
const url = "https://alb.chrt.com";
const headersObject = {
  authorization: `Bearer ${accessToken}`,
};

//-- Make GET request --//
try {
  let res = await axios.get(url, { headers: headersObject });
  console.log(res); // DEV
  //----//
} catch (err) {
  console.log(err);
}
