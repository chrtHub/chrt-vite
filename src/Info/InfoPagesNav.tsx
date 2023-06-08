//-- react, react-router-dom, Auth0 --//
import { NavLink, useLocation } from "react-router-dom";

//-- TSX Components and Functions --//

//-- NPM Components --//

//-- Icons --//
import {
  ComputerDesktopIcon,
  CpuChipIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

//-- NPM Functions --//

//-- Utility Functions --//
import classNames from "../Util/classNames";

//-- Data Objects, Types --//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function InfoPagesNav() {
  //== React State, Custom Hooks ==//
  const location = useLocation();

  interface NavigationItem {
    nameLine1: string;
    nameLine2?: string;
    href: string;
    current: boolean;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  }
  const navigation: NavigationItem[] = [
    {
      nameLine1: "Support",
      href: "/support",
      current: location.pathname === "/support",
      icon: ComputerDesktopIcon,
    },
    {
      nameLine1: "Terms",
      nameLine2: "of Service",
      href: "/terms",
      current: location.pathname === "/terms",
      icon: DocumentTextIcon,
    },
    {
      nameLine1: "Privacy",
      nameLine2: "Statement",
      href: "/privacy",
      current: location.pathname === "/privacy",
      icon: DocumentTextIcon,
    },
    {
      nameLine1: "Cookies",
      href: "/cookies",
      current: location.pathname === "/cookies",
      icon: DocumentTextIcon,
    },
    {
      nameLine1: "System",
      nameLine2: "Requirements",
      href: "/system_requirements",
      current: location.pathname === "/system_requirements",
      icon: CpuChipIcon,
    },
    {
      nameLine1: "OAuth 2:",
      nameLine2: "Google",
      href: "/oauth2_google",
      current: location.pathname === "/oauth2_google",
      icon: DocumentTextIcon,
    },
    {
      nameLine1: "FAQ",
      href: "/faq",
      current: location.pathname === "/faq",
      icon: QuestionMarkCircleIcon,
    },
  ];

  //== Auth ==//

  //== Other ==//
  //-- Render Icon Helper Function --//
  const renderIcon = (
    Icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
  ) => <Icon className="mr-2 h-5 w-5" aria-hidden="true" />;

  //== Side Effects ==//

  //== Event Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-zinc-300 dark:border-zinc-400">
        <nav className="flex overflow-x-auto pb-2">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-1 text-sm font-semibold leading-6"
          >
            {navigation.map((item) => (
              <li key={item.nameLine1}>
                <NavLink
                  to={item.href}
                  className={classNames(
                    "flex h-full flex-row items-center rounded-lg px-2 py-2 text-sm",
                    item.current
                      ? "bg-zinc-400 text-zinc-50 dark:bg-zinc-600 dark:text-zinc-50"
                      : "bg-zinc bg-zinc-200 text-zinc-500 hover:bg-zinc-300 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                  )}
                >
                  {renderIcon(item.icon)}
                  <div className="flex flex-col items-start justify-center">
                    <p
                      className={classNames(
                        item.nameLine1 === "FAQ"
                          ? "pr-4"
                          : item.nameLine1 === "OAuth 2:"
                          ? "pr-2"
                          : ""
                      )}
                    >
                      {item.nameLine1}
                    </p>
                    <p>{item?.nameLine2}</p>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
