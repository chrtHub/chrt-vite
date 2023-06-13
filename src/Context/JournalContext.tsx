//-- react --//
import { useState, createContext, useContext, PropsWithChildren } from "react";

//-- types --//

//-- Create interface and Context --//
export interface IJournalContext {
  filesListState: IFileMetadata[];
  setFilesList: React.Dispatch<React.SetStateAction<IFileMetadata[]>>;
  pl45Days: [] | null; // TODO - add type interface
  setPL45Days: React.Dispatch<React.SetStateAction<[] | null>>;
}

//-- Create context --//
const JournalContext = createContext<IJournalContext | undefined>(undefined);

import { IFileMetadata } from "../App/JournalFiles/types";

//-- Custom Provider Component --//
function JournalContextProvider({ children }: PropsWithChildren) {
  const defaultFilesList: IFileMetadata[] = [
    {
      id: 0,
      file_uuid: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
      filename: "exampleFileName.csv",
      brokerage: "brokerage name",
      last_modified: "2023-01-01T12:00:00.000Z",
      size_mb: "0",
    },
  ];

  //-- State values --//
  const [filesListState, setFilesList] =
    useState<IFileMetadata[]>(defaultFilesList);
  const [pl45Days, setPL45Days] = useState<[] | null>(null); // TODO - add type interface

  //-- Bundle values into journalContextValue --//
  const journalContextValue: IJournalContext = {
    filesListState,
    setFilesList,
    pl45Days,
    setPL45Days,
  };

  //-- Return context provider --//
  return (
    <JournalContext.Provider value={journalContextValue}>
      {children}
    </JournalContext.Provider>
  );
}

//-- Custom Consumer Hook --//
function useJournalContext() {
  const context = useContext(JournalContext);

  if (context === undefined) {
    throw new Error(
      "useJournalContext must be used within a JournalContextProvider"
    );
  }
  return context;
}

//-- Export Provider Component and Consumer Hook ---//
export { JournalContextProvider, useJournalContext };

//-- FOR USE IN OTHER COMPONENTS --//
// import { useJournalContext } from "../../Context/JournalContext";
// let JournalContext = useJournalContext();
