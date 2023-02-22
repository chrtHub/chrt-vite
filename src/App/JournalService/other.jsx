import { journalTradeUUIDsByDateState } from "./atoms";
import { tradeSummaryByTradeUUIDState } from "./atoms";
import { txnsByTradeUUIDState } from "./atoms";

const [journalTradeUUIDsByDate, setJournalTradeUUIDsByDate] = useRecoilState(
  journalTradeUUIDsByDateState
);
const [tradeSummaryByTradeUUID, setTradeSummaryByTradeUUID] = useRecoilState(
  tradeSummaryByTradeUUIDState
);
const [txnsByTradeUUID, setTxnsByTradeUUID] =
  useRecoilState(txnsByTradeUUIDState);

//-- '/' route --//
let res1 = await axios.get(`${VITE_ALB_BASE_URL}/`, {
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
});
setJournalData(res1.data);

//-- /trade_uuids_by_date --//
let date = null; // TODO
let res3 = await axios.get(
  `${VITE_ALB_BASE_URL}/journal/trade_uuids_by_date/${date}`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);
setJournalTradeUUIDsByDate(res3.data);

//-- /trade_summary_by_trade_uuid --//
let trade_uuid = null; // TODO
let res4 = await axios.get(
  `${VITE_ALB_BASE_URL}/journal/trade_summary_by_trade_uuid/${trade_uuid}`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);
setTradeSummaryByTradeUUID(res4.data);

//-- /txns_by_trade_uuid  --//
let res5 = await axios.get(
  `${VITE_ALB_BASE_URL}/journal/txns_by_trade_uuid/${trade_uuid}`,
  {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }
);
setTxnsByTradeUUID(res5.data);
