import { atom } from "recoil";

export const journalPLDayOfWeekState = atom({
  key: "journalPLDayOfWeekState",
  default: null,
});

export const journalPL45DaysState = atom({
  key: "journalPL45DaysState",
  default: [],
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
