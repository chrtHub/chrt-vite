//-- react --//
import { useState, createContext, useContext, PropsWithChildren } from "react";

//-- tsx --//
import { chrtLayoutsOptions as _chrtLayoutsOptions } from "../App/JournalService/Layouts/bundle";

//-- types --//
import {
  IPL45DayRow,
  IStatsAllTime,
} from "../App/JournalService/Types/journal_types";
import {
  ILayouts,
  ILayoutsOption,
} from "../App/JournalService/Types/journal_types";
import { IFileMetadata } from "../App/JournalFiles/types";

//-- Create interface and Context --//
export interface IJournalContext {
  //-- Files --//
  filesListState: IFileMetadata[];
  setFilesList: React.Dispatch<React.SetStateAction<IFileMetadata[]>>;
  //-- react-grid-layout --//
  layoutUrlNameOrObjectId: { type: string; value: string } | null;
  setLayoutUrlNameOrObjectId: React.Dispatch<
    React.SetStateAction<{ type: string; value: string } | null>
  >;
  layoutsOptions: ILayoutsOption[];
  setLayoutsOptions: React.Dispatch<React.SetStateAction<ILayoutsOption[]>>;
  defaultLayoutsOption: ILayoutsOption;
  currentLayoutsOption: ILayoutsOption;
  setCurrentLayoutsOption: React.Dispatch<React.SetStateAction<ILayoutsOption>>;
  saveableLayouts: ILayouts | null;
  setSaveableLayouts: React.Dispatch<React.SetStateAction<ILayouts | null>>;
  unsavedLayoutsChanges: boolean;
  setUnsavedLayoutsChanges: React.Dispatch<React.SetStateAction<boolean>>;
  //-- PL 45 Days --//
  pl45Days: IPL45DayRow[] | null;
  setPL45Days: React.Dispatch<React.SetStateAction<IPL45DayRow[] | null>>;
  aggPL45Days: IPL45DayRow[] | null;
  setAggPL45Days: React.Dispatch<React.SetStateAction<IPL45DayRow[] | null>>;
  pl45DaysFetched: boolean;
  setPL45DaysFetched: React.Dispatch<React.SetStateAction<boolean>>;
  pl45DaysUpdating: boolean;
  setPL45DaysUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  //-- Stats All Time --//
  statsAllTime: IStatsAllTime | null;
  setStatsAllTime: React.Dispatch<React.SetStateAction<IStatsAllTime | null>>;
  statsAllTimeFetched: boolean;
  setStatsAllTimeFetched: React.Dispatch<React.SetStateAction<boolean>>;
  statsAllTimeUpdating: boolean;
  setStatsAllTimeUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}

//-- Create context --//
const JournalContext = createContext<IJournalContext | undefined>(undefined);

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

  //-- ***** ***** START OF STATE VALUES ***** ***** --//
  //-- Files --//
  const [filesListState, setFilesList] =
    useState<IFileMetadata[]>(defaultFilesList);
  //-- react-grid-layout --//
  const [layoutUrlNameOrObjectId, setLayoutUrlNameOrObjectId] = useState<{
    type: string;
    value: string;
  } | null>(null);
  const [layoutsOptions, setLayoutsOptions] =
    useState<ILayoutsOption[]>(_chrtLayoutsOptions);
  const defaultLayoutsOption: ILayoutsOption = layoutsOptions[0];
  const [currentLayoutsOption, setCurrentLayoutsOption] =
    useState<ILayoutsOption>(defaultLayoutsOption);
  const [saveableLayouts, setSaveableLayouts] = useState<ILayouts | null>(null);
  const [unsavedLayoutsChanges, setUnsavedLayoutsChanges] =
    useState<boolean>(false);
  //-- PL 45 Days --//
  const [pl45Days, setPL45Days] = useState<IPL45DayRow[] | null>(null);
  const [aggPL45Days, setAggPL45Days] = useState<IPL45DayRow[] | null>(null);
  const [pl45DaysFetched, setPL45DaysFetched] = useState<boolean>(false);
  const [pl45DaysUpdating, setPL45DaysUpdating] = useState<boolean>(false);
  //-- Stats All Time --//
  const [statsAllTime, setStatsAllTime] = useState<IStatsAllTime | null>(null);
  const [statsAllTimeFetched, setStatsAllTimeFetched] =
    useState<boolean>(false);
  const [statsAllTimeUpdating, setStatsAllTimeUpdating] =
    useState<boolean>(false);
  //-- ***** ***** END OF STATE VALUES ***** ***** --//

  //-- ***** Bundle values into journalContextValue *****--//
  const journalContextValue: IJournalContext = {
    //-- Files --//
    filesListState,
    setFilesList,
    //-- react-grid-layout --//
    layoutUrlNameOrObjectId,
    setLayoutUrlNameOrObjectId,
    layoutsOptions,
    setLayoutsOptions,
    defaultLayoutsOption,
    currentLayoutsOption,
    setCurrentLayoutsOption,
    saveableLayouts,
    setSaveableLayouts,
    unsavedLayoutsChanges,
    setUnsavedLayoutsChanges,
    //-- PL 45 Days --//
    pl45Days,
    setPL45Days,
    aggPL45Days,
    setAggPL45Days,
    pl45DaysFetched,
    setPL45DaysFetched,
    pl45DaysUpdating,
    setPL45DaysUpdating,
    //-- Stats All Time --//
    statsAllTime,
    setStatsAllTime,
    statsAllTimeFetched,
    setStatsAllTimeFetched,
    statsAllTimeUpdating,
    setStatsAllTimeUpdating,
  };

  //-- ***** Return context provider ***** --//
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
