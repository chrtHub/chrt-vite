import { atom } from "recoil";

interface IFoo {
  baz: string;
}

export const fooState = atom<IFoo>({
  key: "fooState",
  default: { baz: "boz" },
});

/**  */
interface ChatResponse {
  response: string;
}

export const chatResponseState = atom<ChatResponse>({
  key: "chatResponseState",
  default: {
    response: "",
  },
});
