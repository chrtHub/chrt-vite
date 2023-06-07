//-- react --//
import { useState, createContext, useContext, PropsWithChildren } from "react";

//-- types --//

//-- Create interface and Context --//
export interface IJournalContext {
  filesListState: IFileMetadata[];
  setFilesList: React.Dispatch<React.SetStateAction<IFileMetadata[]>>;
  journalPL45Days: [] | null;
  setJournalPL45Days: React.Dispatch<React.SetStateAction<[] | null>>;
  journalPLDayOfWeekState: [] | null;
  setJournalPLDayOfWeekState: React.Dispatch<React.SetStateAction<[] | null>>;
  journalTradeUUIDsByDateState: [] | null;
  setJournalTradeUUIDsByDateState: React.Dispatch<
    React.SetStateAction<[] | null>
  >;
  tradeSummaryByTradeUUIDState: [] | null;
  setTradeSummaryByTradeUUIDState: React.Dispatch<
    React.SetStateAction<[] | null>
  >;
  txnsByTradeUUIDState: [] | null;
  setTxnsByTradeUUIDState: React.Dispatch<React.SetStateAction<[] | null>>;
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
  const [journalPL45Days, setJournalPL45Days] = useState<[] | null>(null);
  const [journalPLDayOfWeekState, setJournalPLDayOfWeekState] = useState<
    [] | null
  >(null);
  const [journalTradeUUIDsByDateState, setJournalTradeUUIDsByDateState] =
    useState<[] | null>(null);
  const [tradeSummaryByTradeUUIDState, setTradeSummaryByTradeUUIDState] =
    useState<[] | null>(null);
  const [txnsByTradeUUIDState, setTxnsByTradeUUIDState] = useState<[] | null>(
    null
  );

  //-- Bundle values into journalContextValue --//
  const journalContextValue: IJournalContext = {
    filesListState,
    setFilesList,
    journalPL45Days,
    setJournalPL45Days,
    journalPLDayOfWeekState,
    setJournalPLDayOfWeekState,
    journalTradeUUIDsByDateState,
    setJournalTradeUUIDsByDateState,
    tradeSummaryByTradeUUIDState,
    setTradeSummaryByTradeUUIDState,
    txnsByTradeUUIDState,
    setTxnsByTradeUUIDState,
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

//-- TO BE SET UP IN THE COMPONENT TREE ABOVE ALL CONSUMERS OF THIS CONTEXT --//

//-- FOR USE IN OTHER COMPONENTS --//
// import { useJournalContext } from "../../Context/JournalContext";
// let JournalContext = useJournalContext();
