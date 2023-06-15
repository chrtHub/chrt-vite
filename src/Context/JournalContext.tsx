//-- react --//
import { useState, createContext, useContext, PropsWithChildren } from "react";

//-- types --//
import { PL45DayRow } from "../App/JournalService/Types/journal_types";

//-- Create interface and Context --//
export interface IJournalContext {
  //-- Files --//
  filesListState: IFileMetadata[];
  setFilesList: React.Dispatch<React.SetStateAction<IFileMetadata[]>>;
  //-- Charts --//
  pl45Days: PL45DayRow[] | null;
  setPL45Days: React.Dispatch<React.SetStateAction<PL45DayRow[] | null>>;
  pl45DaysFetched: boolean;
  setPL45DaysFetched: React.Dispatch<React.SetStateAction<boolean>>;
  pl45DaysUpdating: boolean;
  setPL45DaysUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  //----//
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
  //-- Files --//
  const [filesListState, setFilesList] =
    useState<IFileMetadata[]>(defaultFilesList);
  //-- Charts --//
  const [pl45Days, setPL45Days] = useState<PL45DayRow[] | null>(null);
  const [pl45DaysFetched, setPL45DaysFetched] = useState<boolean>(false);
  const [pl45DaysUpdating, setPL45DaysUpdating] = useState<boolean>(false);
  //----//

  //-- Bundle values into journalContextValue --//
  const journalContextValue: IJournalContext = {
    //-- Files --//
    filesListState,
    setFilesList,
    //-- Charts --//
    pl45Days,
    setPL45Days,
    pl45DaysFetched,
    setPL45DaysFetched,
    pl45DaysUpdating,
    setPL45DaysUpdating,
    //----//
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
