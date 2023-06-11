//-- react, react-router-dom, Auth0 --//
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components and Functions --//;
import { useAccountContext } from "../../Context/AccountContext";
import { axiosErrorToaster } from "../../Errors/axiosErrorToaster";

//-- NPM Components --//

//-- Icons --//
import {
  KeyIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";

//-- NPM Functions --//
import { toast } from "react-toastify";

//-- Utility Functions --//
import classNames from "../../Util/classNames";
import { renderIcon } from "../../Util/renderIcon";
import { getUserPermissions } from "./Subscriptions/Util/getUserPermissions";
import { getUserClickwrapData } from "./DataPrivacy/Clickwrap/Util/getUserClickwrapData";

//-- Data Objects, Types --//
import { AxiosError } from "axios";

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function AccountOutlet() {
  //== React State, Custom Hooks ==//
  const AccountContext = useAccountContext();
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();
  const location = useLocation();

  //-- Navigation items, determine current item --//
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
  async function fetchUserPermissionsAndClickwrapData() {
    let accessToken = await getAccessTokenSilently();
    try {
      await getUserPermissions(accessToken, AccountContext);
      await getUserClickwrapData(accessToken, AccountContext);
    } catch (err) {
      //-- Calling 'getUserPermissions' within ActiveSubscriptionsWithFallback. Using ErrorBoundary there. --//
      //-- Calling 'getUserClickwrapData' within ClickwrapWithFallback. Using ErrorBoundary there. --//
    }
  }

  //== Side Effects ==//
  //-- On mount, get user agreements and permissions --//
  useEffect(() => {
    fetchUserPermissionsAndClickwrapData();
  }, []);

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
