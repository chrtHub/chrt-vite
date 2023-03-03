import { atom } from "recoil";

//-- If theme set in localStorage, use that --//
let theme: string | null = localStorage.getItem("theme"); //-- light || dark || null --//

//-- Else use OS preference --//
if (!theme) {
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? (theme = "dark")
    : (theme = "light");
}

export const echartsThemeState = atom({
  key: "echartsThemeState",
  default: theme,
});
