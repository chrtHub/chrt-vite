import { addDays, format, isWeekend } from "date-fns";

//-- Build array of trading dates from the past number of calendar days --//
export default function getTradingDatesAndProfitsArray(numberOfCalendarDays) {
  const now = new Date();
  const dateArray = [];

  //-- 2023 to 2025 market holidays --//
  //-- https://www.nyse.com/markets/hours-calendars --//
  const tradingHolidays = [
    "2023-01-02",
    "2023-01-16",
    "2023-02-20",
    "2023-04-07",
    "2023-05-29",
    "2023-06-19",
    "2023-07-04",
    "2023-09-04",
    "2023-11-23",
    "2023-12-25",
    "2024-01-01",
    "2024-01-15",
    "2024-02-19",
    "2024-03-29",
    "2024-05-27",
    "2024-06-19",
    "2024-07-04",
    "2024-09-02",
    "2024-11-28",
    "2024-12-25",
    "2025-01-01",
    "2025-01-20",
    "2025-02-17",
    "2025-04-18",
    "2025-05-26",
    "2025-06-19",
    "2025-07-04",
    "2025-09-01",
    "2025-11-27",
    "2025-12-25",
  ];

  for (let i = 0; i < numberOfCalendarDays; i++) {
    const date = format(addDays(now, -i), "yyyy-MM-dd");

    let yyyy = date.substring(0, 4);
    let MM = date.substring(5, 7) - 1; //-- Months are 0 indexed --//
    let dd = date.substring(8, 10);

    //-- Skip weekends and trading holidays --//
    if (isWeekend(new Date(yyyy, MM, dd)) || tradingHolidays.includes(date)) {
      continue;
    }

    //-- Add valid trading days to dateArray --//
    dateArray.push({
      date: date,
      profit: 0,
    });
  }
  return dateArray;
}
