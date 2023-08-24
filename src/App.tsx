//-- react, react-router-dom, Auth0 --//
import { useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//
import AppLayout from "./Layout/AppLayout";
import LandingPage from "./LandingPage/LandingPage";
import { SiteContextProvider } from "./Context/SiteContext";
import { AccountContextProvider } from "./Context/AccountContext";
import { JournalContextProvider } from "./Context/JournalContext";
import { ChatContextProvider } from "./Context/ChatContext";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Environment Variables, TypeScript Interfaces, Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function App() {
  //-- ContextsProvider as nested Contexts Providers --//
  interface IContextsProviderProps {
    children: ReactNode;
  }
  const ContextsProvider = ({ children }: IContextsProviderProps) => {
    return (
      <SiteContextProvider>
        <AccountContextProvider>
          <JournalContextProvider>
            <ChatContextProvider>
              {children}
              {/*----*/}
            </ChatContextProvider>
          </JournalContextProvider>
        </AccountContextProvider>
      </SiteContextProvider>
    );
  };

  const AppLayoutWithContexts = () => {
    return (
      <ContextsProvider>
        <AppLayout />
      </ContextsProvider>
    );
  };

  //-- Check for authenticated user --//
  const { isLoading, isAuthenticated } = useAuth0();
  let auth0Stuff = false;
  try {
    //-- Check cookies (used for desktop) for Auth0 stuff --//
    const auth0Cookies = document.cookie
      .split("; ")
      .filter((cookie) => cookie.includes("auth0"));
    if (auth0Cookies.length > 0) {
      auth0Stuff = true;
    }

    //-- Check localStorage (used for mobile) for Auth0 stuff --//
    for (let key in localStorage) {
      if (key.includes("auth0")) {
        auth0Stuff = true;
      }
    }
  } catch (err) {
    console.log(err);
  }

  //-- ***** ***** ***** Scenarios ***** ***** ***** --//
  //-- isLoading starts as 'true'. If auth0Stuff was found, show the AppLayout while sending request to Auth0 to check the user's auth status --//
  if (isLoading && auth0Stuff) {
    return <AppLayoutWithContexts />;
  }

  //-- Loading is complete and no authenticated user was found --//
  if (!isLoading && !isAuthenticated) {
    //-- For the '/' route, show the landing page --//
    if (window.location.pathname === "/") {
      return (
        <SiteContextProvider>
          <LandingPage />
        </SiteContextProvider>
      );
    } else {
      //-- For protected routes, Outlet renders the AuthGuard component, redirecting users to sign in --//
      return <AppLayoutWithContexts />;
    }
  }

  //-- Loading is complete, user is authenticated --> show the app --//
  if (isAuthenticated) {
    return <AppLayoutWithContexts />;
  }

  return <></>; //-- In the name of type safety, this prevents returning 'undefined' --//
}
