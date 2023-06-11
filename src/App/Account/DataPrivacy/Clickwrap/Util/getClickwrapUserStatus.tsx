import { IAccountContext } from "../../../../../Context/AccountContext";
import { IClickwrapUserStatus } from "../Types/clickwrap_types";
import axios from "axios";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

export const getClickwrapUserStatus = async (
  accessToken: string,
  AccountContext: IAccountContext
) => {
  try {
    //-- Make GET request --//
    let res = await axios.get(`${VITE_ALB_BASE_URL}/legal/clickwrap_status`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data: IClickwrapUserStatus = res.data;
    AccountContext.setClickwrapActive(data.activeAgreement);
    AccountContext.setClickwrapAgreements(data.agreements);
    AccountContext.setClickwrapStatusFetched(true);
    //----//
  } catch (err) {
    console.log(err); // DEV
    throw err;
  }
};
