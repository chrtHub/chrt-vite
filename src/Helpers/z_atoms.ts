import { atom } from "recoil";

interface IFoo {
  bar: string;
}

export const fooState = atom<IFoo>({
  key: "fooState",
  default: { bar: "baz" },
});
