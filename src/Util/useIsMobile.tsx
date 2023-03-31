import UAParser from "ua-parser-js";

const useIsMobile = () => {
  //-- For mobile clients, use 'localStorage' cache because sometimes the auth redirect hangs if using 'memory' --//
  const parser = new UAParser();
  const userAgent = parser.getResult();
  const type = userAgent.device.type;
  const mobileTypes = [
    "console", //-- e.g. Xbox --//
    "mobile", //-- e.g. iPhone --//
    "tablet", //-- e.g. iPad --//
    "smarttv", //-- e.g. Apple TV --//
    "wearable", //-- e.g. Apple Watch --//
    "embedded", //-- e.g. iot device --//
  ];
  const isMobile = type ? mobileTypes.includes(type) : false;
  return isMobile;
};

export default useIsMobile;
