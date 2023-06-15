//-- react, react-router-dom, Auth0 --//
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useJournalContext } from "../Context/JournalContext";
import { useSiteContext } from "../Context/SiteContext";
import { useErrorBoundary } from "react-error-boundary";

//-- TSX Components --//
import EChartInit from "../App/ECharts/EChartInit";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";
import { format, parseISO } from "date-fns";
import numeral from "numeral";

//-- Utility Functions --//
import { throwAxiosError } from "../Errors/throwAxiosError"; // DEV

//== Environment Variables, TypeScript Interfaces, Data Objects ==//
// import { SomeType } from "../App/JournalService/Types/journal_types";
import { zinc } from "../Util/TailwindPalette";
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function PL_45_Days_Config() {
  //== React State, Custom Hooks ==//
  let JC = useJournalContext();
  let SC = useSiteContext();
  const { showBoundary } = useErrorBoundary();

  //== Auth ==//
  const { getAccessTokenSilently } = useAuth0();

  //== Other [ECharts options] ==//
  const option = {
    backgroundColor: SC.theme === "light" ? zinc._50 : zinc._800,
    grid: {
      left: "12",
      right: "12",
      top: "18",
      bottom: "0",
      containLabel: true,
    },
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: [],
    animation: false,
  };

  //== Side Effects ==//
  useEffect(() => {
    const fetchData = async () => {
      try {
        // throwAxiosError(400); // DEV

        //-- Get access token from memory or request new token --//
        let accessToken = await getAccessTokenSilently();

        //-- pl_last_45_calendar_days --//
        let res = await axios.get(`${VITE_ALB_BASE_URL}/journal/some_path`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        // let data: SomeType[] = res.data;

        //-- Set state --//
        // JC.setSomeStateValue(reversedDatesAndProfits);
      } catch (err) {
        //-- Show error boundary --//
        showBoundary(err);
      } finally {
        //-- Set fetched --//
        // JC.setSomethingFetched(true);
      }
    };
    fetchData();
  }, [getAccessTokenSilently]);

  //== Handlers ==//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return <EChartInit option={option} />;
}
