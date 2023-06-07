//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import InfoPagesNav from "../InfoPagesNav";
import TypographyWrapper from "../TypographyWrapper";
import CookiesDoc from "./CookiesDoc";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Cookies() {
  return (
    <>
      <InfoPagesNav />
      <TypographyWrapper>
        <CookiesDoc />
      </TypographyWrapper>
    </>
  );
}
