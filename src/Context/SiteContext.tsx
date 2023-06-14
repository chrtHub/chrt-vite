//-- react --//
import { useState, createContext, useContext, PropsWithChildren } from "react";

//-- types --//

//-- Create interface and Context --//
export interface ISiteContext {
  setManualDarkMode: () => void;
  setOSTheme: () => void;
  setManualLightMode: () => void;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  themeButtonSelection: string | null;
  setThemeButtonSelection: React.Dispatch<React.SetStateAction<string | null>>;
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

  //-- Functions --//
  const setManualDarkMode = () => {
    //-- Set theme to dark in localStorage --//
    localStorage.setItem("theme", "dark");
    //-- Update theme to dark mode --//
    document.documentElement.classList.add("dark");
    //-- Update themeButtonSelection --//
    setThemeButtonSelection("dark");
  };
  const setOSTheme = () => {
    //-- Remove theme from localStorage --//
    localStorage.removeItem("theme");
    //-- Update theme to match current OS theme --//
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    //-- Update themeButtonSelection --//
    setThemeButtonSelection(null);
  };
  const setManualLightMode = () => {
    //-- Set theme to light in localStorage --//
    localStorage.setItem("theme", "light");
    //-- Update theme to light mode --//
    document.documentElement.classList.remove("dark");
    //-- Update themeButtonSelection --//
    setThemeButtonSelection("light");
  };

  //-- If theme set in localStorage, use that ("light" | "dark" | null) --//
  let initialTheme: string | null = localStorage.getItem("theme");
  let initialThemeButtonSelection = initialTheme; //-- Don't use the window.matchMedia value here --//
  //-- Else use OS preference --//
  if (!initialTheme) {
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? (initialTheme = "dark")
      : (initialTheme = "light");
  }

  //-- State values --//
  const [theme, setTheme] = useState<string>(initialTheme);
  const [themeButtonSelection, setThemeButtonSelection] = useState<
    string | null
  >(initialThemeButtonSelection);

  //-- Bundle values into siteContextValue --//
  const siteContextValue: ISiteContext = {
    setManualDarkMode,
    setOSTheme,
    setManualLightMode,
    theme,
    setTheme,
    themeButtonSelection,
    setThemeButtonSelection,
  };

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
