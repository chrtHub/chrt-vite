//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { barState } from "./atoms";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//-- Data Objects, Environment Variables --//
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ComponentName() {
  //-- React State --//
  const [foo, setFoo] = useState(null);

  //-- Recoil State --//
  const [bar, setBar] = useRecoilState(barState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Data Fetching --//
  const fetchData = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- fetch from '/' route
      let res = await axios.get(`${VITE_ALB_BASE_URL}/`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      setJournalData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  //-- Other [] --//

  //-- Click Handlers --//

  //-- Side Effects --//
  useEffect(() => {
    console.log("side effect");
  }, []);

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div>
      <p>content</p>
    </div>
  );
}
