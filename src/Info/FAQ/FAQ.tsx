//-- react, react-router-dom, Auth0 --//

//-- TSX Components --//
import InfoPagesNav from "../InfoPagesNav";
import TypographyWrapper from "../TypographyWrapper";
import FAQDoc from "./FAQDoc";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function FAQ() {
  return (
    <>
      <InfoPagesNav />
      <TypographyWrapper>
        <FAQDoc />
      </TypographyWrapper>
    </>
  );
}
