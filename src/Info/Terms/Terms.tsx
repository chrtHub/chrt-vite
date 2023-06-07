//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import InfoPagesNav from "../InfoPagesNav";
import TypographyWrapper from "../TypographyWrapper";
import TermsDoc from "./TermsDoc";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Terms() {
  return (
    <>
      <InfoPagesNav />
      <TypographyWrapper>
        <TermsDoc />
      </TypographyWrapper>
    </>
  );
}
