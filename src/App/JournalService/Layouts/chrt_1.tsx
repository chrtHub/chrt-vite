import { Layout } from "react-grid-layout";
import { LayoutsOption } from "../Types/journal_types";

const chrt_1_big: Layout[] = [
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
    x: 8,
    y: 16,
    w: 6,
    h: 8,
    minW: 4,
    minH: 6,
  },
];

const chrt_1_small: Layout[] = [
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

export const chrt_1: LayoutsOption = {
  author: "chrt",
  name: "CHRT 1",
  layoutsObject: {
    lg: chrt_1_big,
    md: chrt_1_big,
    sm: chrt_1_small,
    xs: chrt_1_small,
    xxs: chrt_1_small,
  },
};
