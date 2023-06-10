//== react, react-router-dom, Auth0 ==//
import { useAuth0 } from "@auth0/auth0-react";
import { useAccountContext } from "../../../Context/AccountContext";
//== TSX Components, Functions ==//
import { getClickwrapUserStatus } from "./getClickwrapUserStatus";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios, { AxiosError } from "axios";

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;
import {
  CURRENT_TERMS_EFFECTIVE_DATE,
  CURRENT_PRIVACY_EFFECTIVE_DATE,
  CURRENT_COOKIES_EFFECTIVE_DATE,
  CURRENT_AGE_REQUIREMENT_STATEMENT,
} from "./currentAgreements";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ClickwrapWithdrawButton({ setModalOpen }: IProps) {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();

  //== Auth ==//
  let { getAccessTokenSilently, user } = useAuth0();

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//
  const withdrawClickwrapHandler = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      let res = await axios.post(
        `${VITE_ALB_BASE_URL}/legal/withdraw_clickwrap`,
        //-- Body Content --//
        {
          TERMS_VERSION_EFFECTIVE_DATE: CURRENT_TERMS_EFFECTIVE_DATE,
          PRIVACY_VERSION_EFFECTIVE_DATE: CURRENT_PRIVACY_EFFECTIVE_DATE,
          COOKIES_VERSION_EFFECTIVE_DATE: CURRENT_COOKIES_EFFECTIVE_DATE,
          AGE_REQUIREMENT_STATEMENT: CURRENT_AGE_REQUIREMENT_STATEMENT,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = res.data;
      console.log(data); // DEV

      // TODO - fetch agreements again
      await getClickwrapUserStatus(accessToken, AccountContext);
      //----//
    } catch (err) {
      console.log(err); // DEV
      throw err;
    }
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return <button onClick={withdrawClickwrapHandler}>submit</button>;
}
