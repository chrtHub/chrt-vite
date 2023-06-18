import { Layout } from "react-grid-layout";
import { LayoutsOption } from "../Types/journal_types";

const chrt_2_big: Layout[] = [
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

const chrt_2_small: Layout[] = [
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

export const chrt_2: LayoutsOption = {
  author: "chrt",
  name: "CHRT 2",
  layoutsObject: {
    lg: chrt_2_big,
    md: chrt_2_big,
    sm: chrt_2_small,
    xs: chrt_2_small,
    xxs: chrt_2_small,
  },
};
