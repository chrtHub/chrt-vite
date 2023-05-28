import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";

export function throwAxiosError(
  type: 400 | 401 | 500 | "network" | "bad_request"
) {
  let status: number | undefined;
  let statusText: string | undefined;
  let code: string | undefined;

  if (type === 400) {
    status = 400;
    statusText = "Bad Request";
  } else if (type === 401) {
    status = 401;
    statusText = "Unauthorized";
  } else if (type === 500) {
    status = 500;
    statusText = "Internal Server Error";
  } else if (type === "network") {
    code = "ERR_NETWORK";
  } else if (type === "bad_request") {
    code = "ERR_BAD_REQUEST";
  }

  let data: string = `throwAxiosError ${status}`;

  throw new AxiosError(
    //-- message --//
    `Request failed with status code ${status}`,

    //-- code --//
    code,

    //-- config --//
    { headers: new AxiosHeaders() },

    //-- request --//
    undefined,

    //-- response --//
    {
      status: status,
      statusText: statusText,
      headers: {},
      config: {},
      data: data,
    } as AxiosResponse
  );
}
