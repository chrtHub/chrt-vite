//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import InfoPagesNav from "../InfoPagesNav";
import TypographyWrapper from "../TypographyWrapper";
import SystemRequirementsDoc from "./SystemRequirementsDoc";
//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function SystemRequirements() {
  return (
    <>
      <InfoPagesNav />
      <TypographyWrapper>
        <SystemRequirementsDoc />
      </TypographyWrapper>
    </>
  );
}
