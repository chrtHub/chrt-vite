//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import InfoPagesNav from "../InfoPagesNav";
import TypographyWrapper from "../TypographyWrapper";
import OAuth2GoogleDoc from "./OAuth2GoogleDoc";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function OAuth2Google() {
  return (
    <>
      <InfoPagesNav />
      <TypographyWrapper>
        <OAuth2GoogleDoc />
      </TypographyWrapper>
    </>
  );
}
