import { atom } from "recoil";

const barState = atom({
  key: "barState",
  default: { bar: "baz" },
});
