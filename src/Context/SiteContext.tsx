//-- react --//
import {
  useState,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";

//-- types --//

//-- Create interface and Context --//
export interface ISiteContext {
  infoMode: boolean;
  theme: string | null;
  setTheme: React.Dispatch<React.SetStateAction<string | null>>;
  eChartsTheme: string | null;
  setEChartsTheme: React.Dispatch<React.SetStateAction<string | null>>;
  themeButtonSelection: string | null;
  setThemeButtonSelection: React.Dispatch<React.SetStateAction<string | null>>;
  setManualDarkMode: () => void;
  setOSTheme: () => void;
  setManualLightMode: () => void;
}

//-- Create context --//
const SiteContext = createContext<ISiteContext | undefined>(undefined);

//-- Custom Provider Component --//
function SiteContextProvider({ children }: PropsWithChildren) {
  //-- NOTES ABOUT THEMES: --//
  //-- OS theme changes are listened for in index.html --//
  //-- Manual theme overrides are listened for here --//
  //-- In both cases, the documentElement's classList is modified --//
  //-- The localStorage 'theme' value nullifies any OS theme change events --//
  //-- (the OS-based event listener in index.html only works if there's no 'theme' value in localstorage) --//

  //-- The ECharts Theme is set here to follow the application theme --//
  //-- When no localStorage 'theme' value is set, OS theme is listened to --//
  //-- When localStorage 'theme' value is set, that's used --//

  //-- Functions --//
  const setManualDarkMode = () => {
    //-- Set theme to dark in localStorage --//
    localStorage.setItem("theme", "dark");
    //-- Update theme to dark mode --//
    document.documentElement.classList.add("dark");
    setEChartsTheme("dark");
    //-- Update themeButtonSelection --//
    setThemeButtonSelection("dark");
  };
  const setOSTheme = () => {
    //-- Remove theme from localStorage --//
    localStorage.removeItem("theme");
    //-- Update theme to match current OS theme --//
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setEChartsTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setEChartsTheme("light");
    }
    //-- Update themeButtonSelection --//
    setThemeButtonSelection(null);
  };
  const setManualLightMode = () => {
    //-- Set theme to light in localStorage --//
    localStorage.setItem("theme", "light");
    //-- Update theme to light mode --//
    document.documentElement.classList.remove("dark");
    setEChartsTheme("light");
    //-- Update themeButtonSelection --//
    setThemeButtonSelection("light");
  };

  //-- State values --//
  const infoModeRoutes: string[] = [
    "/info",
    "/cookies",
    "/faq",
    "/oauth2_google",
    "/privacy",
    "/product_specific_terms",
    "/support",
    "/system_requirements",
    "/terms",
  ];
  const [infoMode, setInfoMode] = useState<boolean>(
    infoModeRoutes.includes(window.location.pathname)
  );

  //-- If theme set in localStorage, use that ("light" | "dark" | null) --//
  let initialTheme: string | null = localStorage.getItem("theme");
  //-- Else use OS preference --//
  if (!initialTheme) {
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? (initialTheme = "dark")
      : (initialTheme = "light");
  }
  const [theme, setTheme] = useState<string | null>(initialTheme);
  const [eChartsTheme, setEChartsTheme] = useState<string | null>(initialTheme);
  const [themeButtonSelection, setThemeButtonSelection] = useState<
    string | null
  >(initialTheme);

  //-- Bundle values into siteContextValue --//
  const siteContextValue: ISiteContext = {
    infoMode,
    theme,
    setTheme,
    eChartsTheme,
    setEChartsTheme,
    themeButtonSelection,
    setThemeButtonSelection,
    setManualDarkMode,
    setOSTheme,
    setManualLightMode,
  };

  useEffect(() => {
    const handleThemeChange = ({ matches }: MediaQueryListEvent) => {
      //-- Only react to OS theme changes if no 'theme' value is set in localStorage --//
      if (!("theme" in localStorage)) {
        if (matches) {
          setEChartsTheme("dark");
        } else {
          setEChartsTheme("light");
        }
      }
    };

    //-- Listen for OS theme changes --//
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleThemeChange);

    return window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", handleThemeChange);
  }, []);

  //-- Return context provider --//
  return (
    <SiteContext.Provider value={siteContextValue}>
      {children}
    </SiteContext.Provider>
  );
}

//-- Custom Consumer Hook --//
function useSiteContext() {
  const context = useContext(SiteContext);

  if (context === undefined) {
    throw new Error("useSiteContext must be used within a SiteContextProvider");
  }
  return context;
}

//-- Export Provider Component and Consumer Hook ---//
export { SiteContextProvider, useSiteContext };

//-- FOR USE IN OTHER COMPONENTS --//
// import { useSiteContext } from "../../Context/SiteContext";
// let SiteContext = useSiteContext();
