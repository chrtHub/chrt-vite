//-- Charts --//
//-- PL 45 Days --//
export interface DateAndProfitRow {
  date: string;
  profit: string;
}
export interface PL45DayRow {
  [string, string];
}

//-- Stats All Time --//
export interface StatsAllTime {
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
