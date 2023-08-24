//== react, react-router-dom, Auth0 ==//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAccountContext } from "../../../../Context/AccountContext";
import { useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import { getUserClickwrapData } from "./Util/getUserClickwrapData";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios from "axios";
//== Utility Functions ==//
import classNames from "../../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { CURRENT_AGREEMENTS } from "./Util/CURRENT_AGREEMENTS";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function GrantConsentForm() {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();
  const { showBoundary } = useErrorBoundary();
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [privacyChecked, setPrivacyChecked] = useState<boolean>(false);
  const [cookiesChecked, setCookiesChecked] = useState<boolean>(false);
  const [ageChecked, setAgeChecked] = useState<boolean>(false);
  const [allChecked, setAllChecked] = useState<boolean>(false);

  //== Auth ==//
  let { getAccessTokenSilently, user } = useAuth0();

  //== Other ==//

  //== Side Effects ==//
  //-- Endable/disable submit button --//
  useEffect(() => {
    if (termsChecked && privacyChecked && cookiesChecked && ageChecked) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [termsChecked, privacyChecked, cookiesChecked, ageChecked]);

  //== Handlers ==//
  //-- Submit Clickwrap Handler --//
  const grantConsentHandler = async () => {
    AccountContext.setClickwrapStatusChanging(true);
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      await axios.post(
        `${VITE_ALB_BASE_URL}/legal/grant_clickwrap`,
        //-- Body Content --//
        {
          CURRENT_AGREEMENTS: CURRENT_AGREEMENTS,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //-- Fetch and update user's clickwrap status --//
      await getUserClickwrapData(accessToken, AccountContext);
      AccountContext.setClickwrapStatusChanging(false);
      //----//
    } catch (err) {
      AccountContext.setClickwrapStatusChanging(false);
      showBoundary(err);
    }
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="w-full divide-y divide-zinc-300 rounded-lg bg-white px-6 pb-6 pt-3 shadow dark:divide-zinc-600 dark:bg-zinc-950">
      <h2 className="mb-2 flex w-full items-center justify-center font-semibold text-zinc-600 dark:text-zinc-100">
        User Agreements
      </h2>
      {/* Start of Terms of Service */}
      <div className="flex flex-row items-start py-3">
        {/* Text and link */}
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            I agree to CHRT's{" "}
            <a
              href={"https://chrt.com/terms"}
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 underline dark:text-blue-400"
            >
              {CURRENT_AGREEMENTS.termsOfService.name}
            </a>{" "}
            <span className="text-sm font-normal italic text-zinc-500 dark:text-zinc-400">
              (Effective: {CURRENT_AGREEMENTS.termsOfService.date})
            </span>
          </p>
        </div>

        {/* Checkbox */}
        <div className="ml-auto flex w-12 items-center justify-center">
          <input
            type="checkbox"
            onChange={(event) => setTermsChecked(event.target.checked)}
            className="h-5 w-5 rounded border-zinc-300 text-green-600 focus:ring-green-600"
          />
        </div>
      </div>
      {/* End of Terms of Service */}

      {/* Start of Privacy Statement */}
      <div className="flex flex-row items-start py-3">
        {/* Text and link */}
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            I agree to CHRT's{" "}
            <a
              href={"https://chrt.com/privacy"}
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 underline dark:text-blue-400"
            >
              {CURRENT_AGREEMENTS.privacyStatement.name}
            </a>{" "}
            <span className="text-sm font-normal italic text-zinc-500 dark:text-zinc-400">
              (Effective: {CURRENT_AGREEMENTS.privacyStatement.date})
            </span>
          </p>
        </div>

        {/* Checkbox */}
        <div className="ml-auto flex w-12 items-center justify-center">
          <input
            type="checkbox"
            onChange={(event) => setPrivacyChecked(event.target.checked)}
            className="h-5 w-5 rounded border-zinc-300 text-green-600 focus:ring-green-600"
          />
        </div>
      </div>
      {/* End of Privacy Statement */}

      {/* Start of Cookies Policy */}
      <div className="flex flex-row items-start py-3">
        {/* Text and link */}
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            I agree to CHRT's{" "}
            <a
              href={"https://chrt.com/cookies"}
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 underline dark:text-blue-400"
            >
              {CURRENT_AGREEMENTS.cookiesPolicy.name}
            </a>{" "}
            <span className="text-sm font-normal italic text-zinc-500 dark:text-zinc-400">
              (Effective: {CURRENT_AGREEMENTS.cookiesPolicy.date})
            </span>
          </p>
        </div>

        {/* Checkbox */}
        <div className="ml-auto flex w-12 items-center justify-center">
          <input
            type="checkbox"
            onChange={(event) => setCookiesChecked(event.target.checked)}
            className="h-5 w-5 rounded border-zinc-300 text-green-600 focus:ring-green-600"
          />
        </div>
      </div>
      {/* End of Cookies Policy */}

      {/* Start of Age Requirement */}
      <div className="flex flex-row items-start py-3">
        {/* Text */}
        <div className="text-sm">
          <label className="font-medium text-zinc-900 dark:text-zinc-50">
            {CURRENT_AGREEMENTS.ageRequirement.statement}
          </label>
        </div>
        {/* Checkbox */}
        <div className="ml-auto flex w-12 items-center justify-center">
          <input
            type="checkbox"
            onChange={(event) => setAgeChecked(event.target.checked)}
            className="h-5 w-5 rounded border-zinc-300 text-green-600 focus:ring-green-600"
          />
        </div>
      </div>
      {/* End of Age Requirement */}

      {/* START OF AGREEMENT STATEMENT AND BUTTON */}
      <div className="flex flex-row pt-3">
        <div className="w-full pr-2 text-sm text-zinc-600 dark:text-zinc-200">
          <p>
            By clicking "Agree" you agree to CHRT's{" "}
            <a
              href="https://chrt.com/terms"
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-800 underline dark:text-zinc-200"
            >
              Terms of Service
            </a>
            ,{" "}
            <a
              href="https://chrt.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-800 underline dark:text-zinc-200"
            >
              Privacy Statement
            </a>
            , and{" "}
            <a
              href="https://chrt.com/cookies"
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-800 underline dark:text-zinc-200"
            >
              Cookies Policy
            </a>
            . You also confirm that you are at least 18 years of age.
          </p>
        </div>
        {/* Agree Button */}
        <div className="ml-auto flex w-32 flex-col justify-end">
          <button
            disabled={!allChecked}
            type="button"
            onClick={grantConsentHandler}
            className={classNames(
              "flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              !allChecked
                ? "cursor-not-allowed bg-zinc-400 text-white"
                : "bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-500"
            )}
          >
            Agree
          </button>
        </div>
        {/* End of agree button */}
      </div>
    </div>
  );
}
