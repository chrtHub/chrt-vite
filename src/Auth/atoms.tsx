import { atom } from "recoil";

export const mobileState = atom<boolean>({
  key: "mobileState",
  default: false,
});
