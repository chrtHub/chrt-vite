import { AxiosError } from "axios";

import { toast } from "react-toastify";

export class ToastError extends Error {}

/**
 * @description handles status 400, status 500, and NetworkError
 * @param err error instanceof AxiosError
 * @param toastTitle if included, the error will be toastified with the toastTitle at the start of the message
 */
export const axiosErrorHandler = (err: AxiosError, toastTitle?: string) => {
  const status = err.response?.status; // DEV - is this http-defined or express code-defined?
  const message = err.response?.data?.toString(); //-- 'message' defined in Express --//

  //-- 400 --//
  if (status === 400) {
    if (toastTitle) {
      toast(`${toastTitle}: ${message}`);
    } else {
      throw new Error(message);
    }
  } //-- 500 --//
  else if (status === 500) {
    if (toastTitle) {
      toast(`${toastTitle}: server error, please try again`);
    } else {
      throw new Error("Server error, please try again");
    }
  } //-- Network ToastError --//
  else if (err.code === "ERR_NETWORK") {
    if (toastTitle) {
      toast(
        `${toastTitle}: network error, please check your connection and try again`
      );
    } else {
      throw new Error(
        "Network error, please check your connection and try again"
      );
    }
  } //-- Other (unexpected errors) --//
  else {
    if (toastTitle) {
      toast(
        `${toastTitle}: unexpected error, please try again. If problems persist, reach out to support@chrt.com`
      );
    } else {
      throw new Error(
        "Unexpected error, please try again. If problems persist, reach out to support@chrt.com"
      );
    }
  }
};
