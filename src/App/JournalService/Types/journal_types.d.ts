//-- Charts --//

import { ObjectId } from "bson";

//-- PL 45 Days --//
export interface IDateAndProfitRow {
  date: string;
  profit: string;
}
export interface IPL45DayRow {
  [string, string];
}

//-- Stats All Time --//
export interface IStatsAllTime {
  total_trades: number;
  total_symbols: number;
  winning_trades: number;
  losing_trades: number;
  breakeven_trades: number;
  total_fees: number;
  sum_winning_trades: number;
  sum_losing_trades: number;
  total_net_proceeds: number;
}

//-- react-grid-layout --//

// Example 'Layout':
// {
//   i: "StatsTable",
//   x: 0,
//   y: 16,
//   w: 6,
//   h: 8,
//   minW: 4,
//   minH: 6,
// },

//-- Note - 'ILayouts' is a breakpoint name + ILayout[] --//
interface ILayoutsOption {
  _id: string; //-- {MONGOIZE} ObjectId --//
  author: string;
  name: string;
  urlName: string; //-- Allow letters, numbers, hyphens, and underscores --//
  layouts: ILayouts;
}
interface ILayoutsOption_Mongo {
  _id: ObjectId; //-- MONGOIZED --//
  author: string;
  name: string;
  urlName: string; //-- Allow letters, numbers, hyphens, and underscores --//
  layouts: ILayouts;
}

//-- Note - Add "I" to each interface name --//
//-- From "react-grid-layout": "1.3.4" --//
interface ILayouts {
  [P: string]: ILayout[];
}

interface ILayout {
  /**
   * A string corresponding to the component key.
   * Uses the index of components instead if not provided.
   */
  i: string;

  /**
   * X position in grid units.
   */
  x: number;

  /**
   * Y position in grid units.
   */
  y: number;

  /**
   * Width in grid units.
   */
  w: number;

  /**
   * Height in grid units.
   */
  h: number;

  /**
   * Minimum width in grid units.
   */
  minW?: number | undefined;

  /**
   * Maximum width in grid units.
   */
  maxW?: number | undefined;

  /**
   * Minimum height in grid units.
   */
  minH?: number | undefined;

  /**
   * Maximum height in grid units.
   */
  maxH?: number | undefined;

  /**
   * set by DragEvents (onDragStart, onDrag, onDragStop) and ResizeEvents (onResizeStart, onResize, onResizeStop)
   */
  moved?: boolean | undefined;

  /**
   * If true, equal to `isDraggable: false` and `isResizable: false`.
   */
  static?: boolean | undefined;

  /**
   * If false, will not be draggable. Overrides `static`.
   */
  isDraggable?: boolean | undefined;

  /**
   * If false, will not be resizable. Overrides `static`.
   */
  isResizable?: boolean | undefined;

  /**
   * By default, a handle is only shown on the bottom-right (southeast) corner.
   * Note that resizing from the top or left is generally not intuitive.
   */
  resizeHandles?: ResizeHandle[] | undefined;

  /**
   * If true and draggable, item will be moved only within grid.
   */
  isBounded?: boolean | undefined;
}
