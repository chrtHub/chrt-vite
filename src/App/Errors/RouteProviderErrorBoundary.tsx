import { Link, useRouteError } from "react-router-dom";

export default function RouteProviderErrorBoundary() {
  let error = useRouteError();

  return (
    <div className="bg-blue-200">
      <p>Error caught by Route Provider Error Boundary</p>
      <Link to="/">Back to Homepage</Link>
    </div>
  );
}
