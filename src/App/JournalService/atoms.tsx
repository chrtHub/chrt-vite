import { atom } from "recoil";

export const journalPL45DaysAtom = atom({
  key: "journalPL45DaysAtom",
  default: [],
});

//----//
export const journalPLDayOfWeekState = atom({
  key: "journalPLDayOfWeekState",
  default: null,
});

export const journalTradeUUIDsByDateState = atom({
  key: "journalTradeUUIDsByDateState",
  default: null,
});

export const tradeSummaryByTradeUUIDState = atom({
  key: "tradeSummaryByTradeUUIDState",
  default: null,
});

export const txnsByTradeUUIDState = atom({
  key: "txnsByTradeUUIDState",
  default: null,
});
