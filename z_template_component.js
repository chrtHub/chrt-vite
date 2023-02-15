//-- react, react-router-dom, recoil, Auth0 --//
import { useState } from "react";
import { useRecoilState } from "recoil";
import barState from "./atoms";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects, Environment Variables --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ComponentName() {
  //-- React State --//
  const [foo, setFoo] = useState(null);

  //-- Recoil State --//
  const [bar, setBar] = useRecoilState(barState);

  //-- Auth --//

  //-- Data Fetching --//

  //-- Other --//

  //-- Click Handlers --//

  //-- Side Effects --//

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div>
      <p>content</p>
    </div>
  );
}
