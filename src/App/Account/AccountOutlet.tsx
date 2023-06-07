//-- react, react-router-dom, Auth0 --//
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//-- TSX Components and Functions --//
import { useAccountContext } from "../../Context/AccountContext";
import { axiosErrorToaster } from "../../Errors/axiosErrorToaster";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import { AxiosError } from "axios";

//-- Utility Functions --//
import { getUsersPermissions } from "./getUserPermissions";

//-- Data Objects, Types --//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function AccountOutlet() {
  //== React State, Custom Hooks ==//
  const location = useLocation();
  let AccountContext = useAccountContext();
  const { getAccessTokenSilently, user } = useAuth0();

  //== Auth ==//
  //== Other ==//
  const navigation = [
    {
      name: "Account",
      href: "/account",
      current: location.pathname === "/account",
    },
    {
      name: "Subscriptions",
      href: "/account/subscriptions",
      current: location.pathname === "/account/subscriptions",
    },
    {
      name: "Settings",
      href: "/account/settings",
      current: location.pathname === "/account/settings",
    },
  ];

  //== Side Effects ==//
  //-- On mount, get user permissions --//
  useEffect(() => {
    async function lambda() {
      let accessToken = await getAccessTokenSilently();
      try {
        await getUsersPermissions(accessToken, AccountContext);
      } catch (err) {
        if (err instanceof AxiosError) {
          axiosErrorToaster(err, "Get subscriptions");
        }
      }
      AccountContext.setRolesFetched(true);
    }
    lambda();
  }, []);

  //== Event Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div>
      <div className="">
        {/* Tabs */}
        <div className="mb-4 border-b border-zinc-500">
          <nav className="flex overflow-x-auto py-4">
            <ul
              role="list"
              className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-zinc-400 sm:px-6 lg:px-8"
            >
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={
                      item.current ? "text-green-600 dark:text-green-500" : ""
                    }
                  >
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
    </div>
  );
}
