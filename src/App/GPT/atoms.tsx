import { atom } from "recoil";

interface IFoo {
  baz: string;
}

export const fooState = atom<IFoo>({
  key: "fooState",
  default: { baz: "boz" },
});

/** Temporary - for single-response chat implementation */
interface ChatResponse {
  prompt: string;
  response: string;
}

export const chatResponseState = atom<ChatResponse>({
  key: "chatResponseState",
  default: {
    prompt: "",
    response: "",
  },
});
