import { ILayout, ILayoutsOption } from "../Types/journal_types";

const chrt_1_md: ILayout[] = [
  {
    i: "StatsTable",
    x: 0,
    y: 16,
    w: 6,
    h: 8,
    minW: 4,
    minH: 6,
  },
  {
    i: "PL_45_Days",
    x: 0,
    y: 0,
    w: 12,
    h: 16,
    minW: 4,
    minH: 6,
  },
  {
    i: "AGG_PL_45_Days",
    x: 6,
    y: 16,
    w: 6,
    h: 8,
    minW: 4,
    minH: 6,
  },
];

const chrt_1_sm: ILayout[] = [
  {
    i: "StatsTable",
    x: 0,
    y: 0,
    w: 6,
    h: 8,
    minW: 4,
    minH: 6,
  },
  {
    i: "PL_45_Days",
    x: 0,
    y: 8,
    w: 12,
    h: 8,
    minW: 4,
    minH: 6,
  },
  {
    i: "AGG_PL_45_Days",
    x: 8,
    y: 0,
    w: 6,
    h: 8,
    minW: 4,
    minH: 6,
  },
];

export const chrt_1: ILayoutsOption = {
  author: "chrt",
  name: "CHRT 1",
  layouts: {
    md: chrt_1_md,
    sm: chrt_1_sm,
  },
};
