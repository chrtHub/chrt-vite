//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { ErrorBoundary } from "react-error-boundary";
import { throwAxiosError } from "../Errors/throwAxiosError";
import { getErrorDetails } from "../Errors/getErrorDetails";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

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
  //== Auth ==//
  //== Other ==//
  throwAxiosError(400); // DEV

  //== Side Effects ==//
  //== Event Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div>
      <p>foo</p>
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