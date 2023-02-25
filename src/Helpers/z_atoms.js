import { atom } from "recoil";

export const barState = atom({
  key: "barState",
  default: { bar: "baz" },
});
