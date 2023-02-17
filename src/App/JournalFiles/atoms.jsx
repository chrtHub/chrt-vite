import { atom } from "recoil";

export const filesListState = atom({
  key: "filesListState",
  default: [
    {
      id: 0,
      filename: "example_file_name.csv",
      brokerage: "brokerage name",
      last_modified: "2023-01-01T12:00:00.000Z",
      size_mb: "0",
    },
  ],
});
