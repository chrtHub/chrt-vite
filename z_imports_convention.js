//-- react, react-router-dom, Auth0, recoil --//
import { useState } from "react";
import { useRecoilState } from "recoil";

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

  return (
    <div>
      <p>content</p>
    </div>
  );
}
