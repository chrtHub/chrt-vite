//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import InfoPagesNav from "../InfoPagesNav";
import TypographyWrapper from "../TypographyWrapper";
import PrivacyDoc from "./PrivacyDoc";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Privacy() {
  return (
    <>
      <InfoPagesNav />
      <TypographyWrapper>
        <PrivacyDoc />
      </TypographyWrapper>
    </>
  );
}
