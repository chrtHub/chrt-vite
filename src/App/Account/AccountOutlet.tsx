//== react, react-router-dom, recoil, Auth0 ==//
import { Outlet, NavLink } from "react-router-dom";

//== TSX Components, Functions ==//

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

const navigation = [
  { name: "Account", href: "/account", current: true },
  { name: "Billing", href: "/account/billing", current: false },
  { name: "Dev Resources", href: "/account/dev_resources", current: false },
];

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function AccountOutlet() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
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
