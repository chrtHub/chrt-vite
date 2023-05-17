import { useRouteError } from "react-router-dom";

export default function IndexErrorBoundary() {
  let error = useRouteError;
  console.error(error);
  return (
    <div>
      <p>Index error boundary</p>
    </div>
  );
}
