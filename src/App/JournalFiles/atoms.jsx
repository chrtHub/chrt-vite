import { atom } from "recoil";

export const filesListState = atom({
  key: "filesListState",
  default: [
    {
      id: 0,
      filename: "example_file_name.csv",
      brokerage: "brokerage name",
      last_modified_iso8601: "",
      last_modified_readable: "MMM dd, YYYY @ hh:mm:ss",
      size_mb: "0",
    },
  ],
});
