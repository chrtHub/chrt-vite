//== react, react-router-dom, Auth0 ==//

//== TSX Components, Functions ==//
import { useAccountContext } from "../../../Context/AccountContext";

//== NPM Components ==//

//== Icons ==//

//== NPM Functions ==//

//== Utility Functions ==//

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
export default function ClickwrapAgreements() {
  //== React State, Custom Hooks ==//
  let AccountContext = useAccountContext();

  //== Auth ==//

  //== Other ==//

  //== Side Effects ==//

  //== Handlers ==//

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <div>
      <p>
        {AccountContext.clickwrapAgreements.map((agreement) => {
          return <p>{agreement.name}</p>;
        })}
      </p>
    </div>
  );
}
