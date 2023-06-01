import { AxiosError } from "axios";

export const getErrorDetails = (error: Error | AxiosError) => {
  //-- All errors have "message" --//
  const errorMessage = error.message;

  //-- For AxiosError only --//
  const isAxiosError = error instanceof AxiosError ? "true" : "false";
  const axiosServerMessage =
    error instanceof AxiosError
      ? typeof error.response?.data === "object"
        ? JSON.stringify(error.response?.data) || ""
        : String(error.response?.data || "")
      : "";
  const axiosHTTPStatus =
    error instanceof AxiosError && error.response?.status
      ? error.response?.status.toString()
      : "";
  const axiosHTTPStatusText =
    error instanceof AxiosError && error.response?.statusText
      ? error.response?.statusText
      : "";

  //-- Function Return --//
  return {
    errorMessage,
    isAxiosError,
    axiosServerMessage,
    axiosHTTPStatus,
    axiosHTTPStatusText,
  };
};
