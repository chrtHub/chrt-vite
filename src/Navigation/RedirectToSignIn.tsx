//-- 2 scenarios: --//
// If not signed in, redirect to login page via AuthGuard
// If signed in, redirect to home page

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectToSignIn() {
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <></>;
}
