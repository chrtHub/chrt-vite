import { atom } from "recoil";

interface IFoo {
  baz: string;
}

export const fooState = atom<IFoo>({
  key: "fooState",
  default: { baz: "boz" },
});
