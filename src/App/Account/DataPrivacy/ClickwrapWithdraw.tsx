//== react, react-router-dom, Auth0 ==//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components, Functions ==//
import { axiosErrorToaster } from "../../../Errors/axiosErrorToaster";
import ClickwrapWithdrawModal from "./ClickwrapWithdrawModal";
//== NPM Components ==//

//== Icons ==//
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";

//== NPM Functions ==//
import axios, { AxiosError } from "axios";

//== Utility Functions ==//
import classNames from "../../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ClickwrapWithdraw() {
  //== React State, Custom Hooks ==//
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  //== Auth ==//
  let { getAccessTokenSilently, user } = useAuth0();
  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <>
      <ClickwrapWithdrawModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-x-1.5 rounded-md bg-rose-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        Withdraw Agreements
        <ShieldExclamationIcon
          className="h-5 w-5 text-rose-200"
          aria-hidden="true"
        />
      </button>
    </>
  );
}
