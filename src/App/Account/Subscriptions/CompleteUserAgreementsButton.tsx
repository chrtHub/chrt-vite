import { useNavigate } from "react-router-dom";

export const CompleteUserAgreementsButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/account/data_privacy")}
      className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      Complete user agreements <span aria-hidden="true">→</span>
    </button>
  );
};
