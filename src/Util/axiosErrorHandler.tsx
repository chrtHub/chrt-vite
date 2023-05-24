import { AxiosError } from "axios";

/**
 * @name axiosErrorHandler
 * @description handles status 400, status 500, and NetworkError
 * @param err error instanceof AxiosError
 */
export const axiosErrorHandler = (err: AxiosError) => {
  const status = err.response?.status;
  const message = err.response?.data?.toString();

  //-- 400 --//
  if (status === 400) {
    throw new Error(message); //-- 'message' defined in Express --//
  } //-- 500 --//
  else if (status === 500) {
    throw new Error("Server error, please try again");
  } //-- Network Error --//
  else if (err.code === "ERR_NETWORK") {
    throw new Error(
      "Network error, please check your connection and try again"
    );
  } //-- Other --//
  else {
    throw new Error(
      "Unexpected error, please try again. If problems persist, reach out to support@chrt.com"
    );
  }
};
