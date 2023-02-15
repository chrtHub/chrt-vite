import { atom } from "recoil";

export const filesListState = atom({
  key: "filesListState",
  default: [
    {
      id: 0,
      filename: "example_file_name.csv",
      brokerage: "brokerage name",
      last_modified: "yyyy-MM-dd @ hh:mm:ss aaa",
      size_mb: "0",
    },
  ],
});
