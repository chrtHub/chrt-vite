import { atom } from "recoil";

let theme = localStorage.getItem("theme");

export const echartsThemeState = atom({
  key: "echartsThemeState",
  default: theme || "light", //-- if null, use 'light' --//
});
