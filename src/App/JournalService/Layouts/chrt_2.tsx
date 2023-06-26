import { ILayout, ILayoutsOption } from "../Types/journal_types";

const chrt_2_md: ILayout[] = [
  {
    i: "StatsTable",
    x: 0,
    y: 0,
    w: 6,
    h: 8,
    minW: 6,
    minH: 8,
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

const chrt_2_sm: ILayout[] = [
  {
    i: "StatsTable",
    x: 0,
    y: 0,
    w: 6,
    h: 12,
    minW: 6,
    minH: 12,
    isResizable: false, // TODO - handle resizing properly
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

export const chrt_2: ILayoutsOption = {
  _id: "dummy_id_2",
  author: "chrt",
  name: "CHRT 2",
  urlName: "chrt_2",
  layouts: {
    md: chrt_2_md,
    sm: chrt_2_sm,
  },
};
