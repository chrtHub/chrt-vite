import { AxiosError } from "axios";

import { toast } from "react-toastify";

/**
 * @description handles status 400, status 500, and NetworkError
 * @param err error instanceof AxiosError
 * @param toastTitle
 */
export const axiosErrorToaster = (
  err: AxiosError,
  toastTitle: string = "Error"
) => {
  const status = err.response?.status; // DEV - is status http-defined or express code-defined?
  const message = err.response?.data?.toString(); //-- 'message' defined in Express --//

  //-- 400 --//
  if (status === 400) {
    toast(`${toastTitle}: ${message}`);
  }
  //-- 401 --//
  else if (status === 401) {
    //-- use Fallback CTA for 401 responses --//
  }
  //-- 500 --//
  else if (status === 500) {
    toast(`${toastTitle}: server error, please try again`);
  }
  //-- Network Error --//
  else if (err.code === "ERR_NETWORK") {
    toast(
      `${toastTitle}: network error, please check your connection and try again`
    );
  }
  //-- Bad Request --//
  else if (err.code === "ERR_BAD_REQUEST") {
    toast(`${toastTitle}: bad request`); // DEV - what causes this?
  }
  //-- Other (unexpected errors) --//
  else {
    toast(
      `${toastTitle}: unexpected error, please try again. If problems persist, reach out to support@chrt.com`
    );
  }
};
