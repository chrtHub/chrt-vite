//-- react, react-router-dom, Auth0 --//
import { Outlet, NavLink, useLocation } from "react-router-dom";

//-- TSX Components and Functions --//;

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
import {
  KeyIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import classNames from "../../Util/classNames";

//-- Data Objects, Types --//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function AccountOutlet() {
  //== React State, Custom Hooks ==//
  const location = useLocation();

  const navigation = [
    {
      name: "Account",
      href: "/account",
      current: location.pathname === "/account",
      icon: UserIcon,
    },
    {
      name: "Settings",
      href: "/account/settings",
      current: location.pathname === "/account/settings",
      icon: Cog8ToothIcon,
    },
    {
      name: "Subscriptions",
      href: "/account/subscriptions",
      current: location.pathname === "/account/subscriptions",
      icon: KeyIcon,
    },
    {
      name: "Data Privacy",
      href: "/account/data_privacy",
      current: location.pathname === "/account/data_privacy",
      icon: ShieldCheckIcon,
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
      <div className="mb-3 border-b border-zinc-300 dark:border-zinc-400">
        <nav className="flex overflow-x-auto pb-2">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-1 text-sm font-semibold leading-6"
          >
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={classNames(
                    "flex flex-row items-center rounded-lg px-2 py-2 ",
                    item.current
                      ? "bg-zinc-300 text-green-600 dark:bg-zinc-600 dark:text-green-400"
                      : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  {renderIcon(item.icon)}
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Outlet */}
      <Outlet />
    </div>
  );
}
