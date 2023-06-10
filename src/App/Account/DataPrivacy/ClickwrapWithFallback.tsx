//== react, react-router-dom, Auth0 ==//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";
import { throwAxiosError } from "../../../Errors/throwAxiosError";
import { getErrorDetails } from "../../../Errors/getErrorDetails";
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//
import axios, { AxiosError } from "axios";

//== Utility Functions ==//
import classNames from "../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
import { IClickwrapUserStatus } from "./clickwrap_types";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Version effective dates --//
const TERMS_VERSION_EFFECTIVE_DATE = "2023-06-09";
const PRIVACY_VERSION_EFFECTIVE_DATE = "2023-06-09";
const COOKIES_VERSION_EFFECTIVE_DATE = "2023-06-09";
const AGE_REQUIREMENT_STATEMENT = "I am at least 18 years of age";

// TODO - CCPA/CRPA
// // right to know
// // right to delete
// // right to opt-out
// // right to non-discrimination
// // right to correct
// // right to limit

// TODO - GDPR
// <<>>

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ComponentNameWithFallback() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Component />
    </ErrorBoundary>
  );
}

//-- ***** ***** ***** COMPONENT ***** ***** ***** --//
const Component = () => {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();
  const { showBoundary } = useErrorBoundary();

  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [privacyChecked, setPrivacyChecked] = useState<boolean>(false);
  const [cookiesChecked, setCookiesChecked] = useState<boolean>(false);
  const [ageChecked, setAgeChecked] = useState<boolean>(false);
  const [allChecked, setAllChecked] = useState<boolean>(false);

  //== Auth ==//
  let { getAccessTokenSilently, user } = useAuth0();

  //== Other ==//
  throwAxiosError(400); // DEV

  const getClickwrapUserStatus = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      let res = await axios.get(`${VITE_ALB_BASE_URL}/legal/clickwrap_status`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const data: IClickwrapUserStatus = res.data;
      AccountContext.setClickwrapAgreementsActive(data.activeAgreement);
      AccountContext.setClickwrapAgreements(data.agreements);
      //----//
    } catch (err) {
      console.log(err); // DEV
      showBoundary(err);
    }
  };

  //== Side Effects ==//
  //-- On mount, get user clickwrap status --//
  useEffect(() => {
    getClickwrapUserStatus();
  }, []);

  //-- Endable/disable submit button --//
  useEffect(() => {
    if (termsChecked && privacyChecked && cookiesChecked && ageChecked) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [termsChecked, privacyChecked, cookiesChecked, ageChecked]);

  interface doc {
    name: string;
    versionEffectiveDate: string;
    href: string;
    setterFn: React.Dispatch<React.SetStateAction<boolean>>;
  }
  const docs: doc[] = [
    {
      name: "Terms of Service",
      versionEffectiveDate: TERMS_VERSION_EFFECTIVE_DATE,
      href: "https://chrt.com/terms",
      setterFn: setTermsChecked,
    },
    {
      name: "Privacy Statement",
      versionEffectiveDate: PRIVACY_VERSION_EFFECTIVE_DATE,
      href: "https://chrt.com/privacy",
      setterFn: setPrivacyChecked,
    },
    {
      name: "Cookies Policy",
      versionEffectiveDate: COOKIES_VERSION_EFFECTIVE_DATE,
      href: "https://chrt.com/cookies",
      setterFn: setCookiesChecked,
    },
  ];

  //== Event Handlers ==//
  //-- Submit Clickwrap Handler --//
  const submitClickwrapHandler = async () => {
    console.log("clickwrap time");
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      let res = await axios.post(
        `${VITE_ALB_BASE_URL}/legal/grant_clickwrap`,
        //-- Body Content --//
        {
          TERMS_VERSION_EFFECTIVE_DATE: TERMS_VERSION_EFFECTIVE_DATE,
          PRIVACY_VERSION_EFFECTIVE_DATE: PRIVACY_VERSION_EFFECTIVE_DATE,
          COOKIES_VERSION_EFFECTIVE_DATE: COOKIES_VERSION_EFFECTIVE_DATE,
          AGE_REQUIREMENT_STATEMENT: AGE_REQUIREMENT_STATEMENT,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res); // DEV
      //----//
    } catch (err) {
      console.log(err);
      // showBoundary(err)
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Agreements");
      }
    }

    // TODO
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="max-w-lg rounded-lg bg-zinc-200 px-6 py-1 shadow">
      {/* CHECKBOXES */}
      {docs.map((doc) => {
        return (
          <div className="relative flex items-start pt-3" key={doc.name}>
            {/* Text and link */}
            <div className="min-w-0 flex-1 text-sm leading-6">
              <p className="font-medium text-zinc-900">
                I agree to CHRT's{" "}
                <a
                  href={doc.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {doc.name}
                </a>
              </p>

              {/* NEW - version effective date*/}
              <p className="text-sm text-zinc-600">
                Version Effective Date: {doc.versionEffectiveDate}
              </p>
            </div>

            {/* Checkbox */}
            <div className="flex h-6 w-10 items-center">
              <input
                type="checkbox"
                onChange={(event) => doc.setterFn(event.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-600"
              />
            </div>
          </div>
        );
      })}

      {/* Age */}
      <div className="relative flex items-start pt-3">
        {/* Text */}
        <div className="min-w-0 flex-1 text-sm leading-6">
          <label className="font-medium text-zinc-900">
            {AGE_REQUIREMENT_STATEMENT}
          </label>
        </div>
        {/* Checkbox */}
        <div className="ml-3 flex h-6 w-10 items-center">
          <input
            type="checkbox"
            onChange={(event) => setAgeChecked(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-600"
          />
        </div>
      </div>

      {/* START OF AGREEMENT STATEMENT AND BUTTON */}
      <div className="mt-2 flex items-start justify-between">
        <div className="text-sm text-zinc-600">
          <p>
            By clicking "Agree" you agree to CHRT's{" "}
            <a
              href="https://chrt.com/terms"
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-800 underline"
            >
              Terms of Service
            </a>
            , <br />
            <a
              href="https://chrt.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-800 underline"
            >
              Privacy Statement
            </a>
            , and{" "}
            <a
              href="https://chrt.com/cookies"
              rel="noopener noreferrer"
              target="_blank"
              className="text-zinc-800 underline"
            >
              Cookies Policy
            </a>
            . You also confirm that you are at least 18 years of age.
          </p>
        </div>

        <button
          disabled={!allChecked}
          type="button"
          onClick={submitClickwrapHandler}
          className={classNames(
            "flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            !allChecked
              ? "cursor-not-allowed bg-zinc-400 text-white"
              : "bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-500"
          )}
        >
          Agree
        </button>
      </div>
    </div>
  );
};

//-- ***** ***** ***** FALLBACK ***** ***** ***** --//
const Fallback = ({ error }: { error: Error }) => {
  const {
    errorMessage,
    isAxiosError,
    axiosServerMessage,
    axiosHTTPStatus,
    axiosHTTPStatusText,
  } = getErrorDetails(error);
  const is401Error = axiosHTTPStatus === "401";

  //-- 401 errors --//
  if (is401Error) {
    return (
      <div>
        <p>{axiosHTTPStatus}</p>
      </div>
    );
  }
  //-- non-401 errors --//
  else {
    return (
      <div>
        <p>{errorMessage}</p>
        <p>{axiosServerMessage}</p>
        <p>{axiosHTTPStatus}</p>
        <p>{axiosHTTPStatusText}</p>
      </div>
    );
  }
};
