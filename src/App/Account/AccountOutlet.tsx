//== react, react-router-dom, recoil, Auth0 ==//
import { Outlet, NavLink, useLocation } from "react-router-dom";

//== TSX Components, Functions ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function AccountOutlet() {
  //== React State, Custom Hooks ==//
  const location = useLocation();

  //== Auth ==//
  //== Other ==//
  const navigation = [
    {
      name: "Account",
      href: "/account",
      current: location.pathname === "/account",
    },
    {
      name: "Billing",
      href: "/account/billing",
      current: location.pathname === "/account/billing",
    },
    {
      name: "Dev Resources",
      href: "/account/dev_resources",
      current: location.pathname === "/account/dev_resources",
    },
  ];

  //== Side Effects ==//
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
                    className={item.current ? "text-green-400" : ""}
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
