//-- react, react-router-dom, Auth0 --//
import { NavLink } from "react-router-dom";
//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//
import {
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  LockClosedIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//
const navigation = [
  { name: "Info", to: "/info", icon: InformationCircleIcon },
  { name: "FAQ", to: "/faq", icon: QuestionMarkCircleIcon },
  {
    name: "Privacy Statement",
    to: "/privacy",
    icon: ClipboardDocumentListIcon,
  },
  { name: "Terms of Service", to: "/terms", icon: DocumentTextIcon },
  {
    name: "Product Specific Terms",
    to: "/product_specific_terms",
    icon: DocumentTextIcon,
  },
  {
    name: "System Requirements",
    to: "/system_requirements",
    icon: ComputerDesktopIcon,
  },
  { name: "Cookies Policy", to: "/cookies", icon: ShieldCheckIcon },
  {
    name: "OAuth 2 - Google Accounts",
    to: "/oauth2_google",
    icon: LockClosedIcon,
  },
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Info() {
  return (
    <div>
      TODO - format links
      {navigation.map((item) => {
        return (
          <NavLink key={item.name} to={item.to}>
            <p>{item.name}</p>
          </NavLink>
        );
      })}
    </div>
  );
}
