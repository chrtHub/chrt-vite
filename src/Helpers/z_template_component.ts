//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//
import classNames from "../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
import { fooState } from "./z_atoms";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ComponentName() {
  //-- React State --//
  const [fooLoading, setFooLoading] = useState<boolean>(false);

  //-- Recoil State --//
  const [bar, setBar] = useRecoilState(fooState);

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
  // return (
  //   <div>
  //     {fooLoading ? <p>foo loading</p> : <></>}
  //     <p>{bar}</p>
  //     <p>baz</p>
  //   </div>
  // );
}
