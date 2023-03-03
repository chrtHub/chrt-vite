import { atom } from "recoil";

export interface IFileMetadata {
  id: number;
  file_uuid: string;
  filename: string;
  brokerage: string;
  last_modified: string;
  size_mb: string;
}

const defaultFilesList: IFileMetadata[] = [
  {
    id: 0,
    file_uuid: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
    filename: "example_file_name.csv",
    brokerage: "brokerage name",
    last_modified: "2023-01-01T12:00:00.000Z",
    size_mb: "0",
  },
];

export const filesListState = atom<IFileMetadata[]>({
  key: "filesListState",
  default: defaultFilesList,
});
