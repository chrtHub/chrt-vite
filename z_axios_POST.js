//-- ***** ***** ***** POST request ***** ***** ***** --//

const url = "https://alb.chrt.com";
const content = {
  key1: "value1",
  key2: "value2",
};
const headersObject = {
  authorization: `Bearer ${accessToken}`,
};

//-- Make POST request --//
try {
  let res = await axios.post(url, content, { headers: headersObject });

  console.log(res); // DEV
} catch (err) {
  console.log(err);
}
