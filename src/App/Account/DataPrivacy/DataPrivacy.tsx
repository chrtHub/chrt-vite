import { useAuth0 } from "@auth0/auth0-react";
import { useAccountContext } from "../../../Context/AccountContext";
import { Fragment } from "react";

export default function DataPrivacy() {
  let AccountContext = useAccountContext();
  let { getAccessTokenSilently, user } = useAuth0();

  return (
    <div className="max-w-lg rounded-lg bg-zinc-200 px-6 py-1 shadow">
      {/* START OF CHECKBOXES */}
      <fieldset className="border-b border-t border-gray-200">
        <div className="divide-y divide-gray-200">
          <div className="relative flex items-start pb-4 pt-3.5">
            <div className="min-w-0 flex-1 text-sm leading-6">
              <label htmlFor="comments" className="font-medium text-gray-900">
                Agreements
              </label>
              <p id="comments-description" className="text-gray-500">
                I have reviewed and I agree to CHRT's{" "}
                <a
                  href="https://chrt.com/terms"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Terms of Service
                </a>
                ,{" "}
                <a
                  href="https://chrt.com/privacy"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  <br />
                  Privacy Statement
                </a>
                , and{" "}
                <a
                  href="https://chrt.com/cookies"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Cookies Policy
                </a>
                .
              </p>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="relative flex items-start pb-4 pt-3.5">
            <div className="min-w-0 flex-1 text-sm leading-6">
              <label htmlFor="offers" className="font-medium text-gray-900">
                Age Requirement
              </label>
              <p id="offers-description" className="text-gray-500">
                I am at least 18 years of age
              </p>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                id="offers"
                aria-describedby="offers-description"
                name="offers"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>
      </fieldset>
      {/* END OF CHECKBOXES */}

      {/* START OF AGREEMENT STATEMENT AND BUTTON */}
      <div className="mt-2 sm:flex sm:items-start sm:justify-between">
        <div className="text-sm text-zinc-500">
          <p>
            By clicking "Agree" you agree to CHRT's{" "}
            <a
              href="https://chrt.com/terms"
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 underline"
            >
              Terms of Service
            </a>
            , <br />
            <a
              href="https://chrt.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 underline"
            >
              Privacy Statement
            </a>
            , and{" "}
            <a
              href="https://chrt.com/cookies"
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 underline"
            >
              Cookies Policy
            </a>
            . You also confirm that you are at least 18 years of age.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        >
          Agree
        </button>
      </div>
      {/* END OF AGREEMENT STATEMENT AND BUTTON */}
    </div>
  );
}

// TODO

// GDPR
// ??

// CCPA/CRPA
// // right to know
// // right to delete
// // right to opt-out
// // right to non-discrimination
// // right to correct
// // right to limit
