import { IClickwrapAgreement } from "../Types/clickwrap_types";

export const CURRENT_AGREEMENTS: Record<string, IClickwrapAgreement> = {
  termsOfService: {
    name: "Terms of Service",
    date: "2023-06-12",
    temporarySiteLink: "https://chrt.com/terms",
    permanentPDFLink:
      "https://chrt-legal-public.s3.amazonaws.com/2023-06-12-TermsOfService.pdf",
  },
  privacyStatement: {
    name: "Privacy Statement",
    date: "2023-06-12",
    temporarySiteLink: "https://chrt.com/privacy",
    permanentPDFLink:
      "https://chrt-legal-public.s3.amazonaws.com/2023-06-12-PrivacyStatement.pdf",
  },
  cookiesPolicy: {
    name: "Cookies Policy",
    date: "2023-06-12",
    temporarySiteLink: "https://chrt.com/cookies",
    permanentPDFLink:
      "https://chrt-legal-public.s3.amazonaws.com/2023-06-12-CookiesPolicy.pdf",
  },
  ageRequirement: {
    name: "Age Requirement",
    date: "n/a",
    temporarySiteLink: "n/a",
    permanentPDFLink: "n/a",
    statement: "I am at least 18 years of age",
  },
};
