import { IClickwrapAgreement } from "../Types/clickwrap_types";

export const CURRENT_AGREEMENTS: Record<string, IClickwrapAgreement> = {
  termsOfService: {
    name: "Terms of Service",
    date: "2023-06-12",
    link: "https://chrt-legal-public.s3.amazonaws.com/2023-06-12-TermsOfService.pdf",
  },
  privacyStatement: {
    name: "Privacy Statement",
    date: "2023-06-12",
    link: "https://chrt-legal-public.s3.amazonaws.com/2023-06-12-PrivacyStatement.pdf",
  },
  cookiesPolicy: {
    name: "Cookies Policy",
    date: "2023-06-12",
    link: "https://chrt-legal-public.s3.amazonaws.com/2023-06-12-TermsOfService.pdf",
  },
  ageRequirement: {
    name: "Age Requirement",
    date: "n/a",
    link: "n/a",
    statement: "I am at least 18 years of age",
  },
};
