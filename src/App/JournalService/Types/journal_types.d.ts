//-- react-grid-layout --//
interface LayoutsOption {
  author: string;
  name: string;
  layoutsObject: Layouts;
}

//-- Charts --//
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
