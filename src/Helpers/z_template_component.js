//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//-- Data Objects, Environment Variables --//
import { barState } from "./atoms";
let VITE_ALB_BASE_URL = import.meta.env.VITE_ALB_BASE_URL;

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ComponentName() {
  //-- React State --//
  const [fooLoading, setFooLoading] = useState(null);

  //-- Recoil State --//
  const [bar, setBar] = useRecoilState(barState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [] --//

  //-- Side Effects --//
  useEffect(() => {
    const fetchData = async () => {
      setFooLoading(true);
      try {
        //-- Get access token from memory or request new token --//
        let accessToken = await getAccessTokenSilently();

        //-- fetch from '/' route
        let res = await axios.get(`${VITE_ALB_BASE_URL}/`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        setBar(res.data);
      } catch (e) {
        console.log(e);
      }
      setFooLoading(false);
    };
    fetchData();
  }, []);

  //-- Click Handlers --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div>
      {fooLoading && <p>foo loading</p>}
      <p>{bar}</p>
      <p>baz</p>
    </div>
  );
}
