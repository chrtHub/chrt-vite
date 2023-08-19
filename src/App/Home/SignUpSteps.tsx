//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//

//== NPM Components ==//
import ReactPlayer from "react-player";

//== Icons ==//
import {
  KeyIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function SignUpSteps() {
  //== React State, Custom Hooks ==//
  //== Auth ==//
  //== Other ==//
  //== Side Effects ==//
  //== Handlers ==//
  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div className="my-2 rounded-lg bg-blue-200 p-3">
      Sign up for chrt
      <UserIcon className="h-5 w-5" />
      <p>(1) Create Account</p>
      <ShieldCheckIcon className="h-5 w-5" />
      <p>(2) Agreements</p>
      <KeyIcon className="h-5 w-5" />
      <p>(3) Free Preview</p>
      {/*  */}
      {/* START OF SIGN UP STEPS VIDEO  */}
      <div className="flex aspect-video flex-row items-center justify-center">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=dM8JRGSa58E"
          width="100%"
          height="100%"
        />
      </div>
      {/* END OF SIGN UP STEPS VIDEO  */}
    </div>
  );
}
