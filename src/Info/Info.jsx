//-- react, react-router-dom, Auth0 --//
import { NavLink } from "react-router-dom";
//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//
const navigation = [
  { name: "Terms of Service", to: "/terms" },
  { name: "Privacy Statement", to: "/privacy" },
  { name: "System Requirements", to: "/system_requirements" },
  { name: "OAuth 2.0 connection via Google", to: "/oauth2_google" },
];

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Info() {
  return (
    // TODO - format links
    <div>
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
