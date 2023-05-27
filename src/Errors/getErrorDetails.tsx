import { AxiosError } from "axios";

export const getErrorDetails = (error: Error | AxiosError) => {
  const errorMessage = error.message;
  const isAxiosError = error instanceof AxiosError ? "true" : "false";
  const data =
    error instanceof AxiosError
      ? typeof error.response?.data === "object"
        ? JSON.stringify(error.response?.data) || ""
        : String(error.response?.data || "")
      : "";
  const httpStatus =
    error instanceof AxiosError ? error.response?.status.toString() || "" : "";
  const httpStatusText =
    error instanceof AxiosError ? error.response?.statusText || "" : "";

  return { errorMessage, isAxiosError, data, httpStatus, httpStatusText };
};
