//-- ***** ***** ***** GET request ***** ***** ***** --//

//-- Request parameters --//
const url = "https://alb.chrt.com";
const headersObject = {
  authorization: `Bearer ${accessToken}`,
};

//-- Make GET request --//
let res = await axios.get(url, { headers: headersObject });
