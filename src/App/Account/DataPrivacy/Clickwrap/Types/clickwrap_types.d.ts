import { ObjectId } from "bson";

//-- Agreement --//
export interface IClickwrapAgreement {
  name: string;
  date: string;
  temporarySiteLink: string;
  permanentPDFLink: string;
  statement?: string;
}

//-- Clickwrap Log --//
export interface IClickwrapLog {
  _id: string; //-- {MONGOIZE} ObjectId --//
  created_at: string; //-- {MONGOIZE} Date --//
  user_db_id: string;
  event: "grant_consent" | "withdraw_consent";
  agreements: IClickwrapAgreement[];
}
export interface IClickwrapLog_Mongo {
  _id: ObjectId; //-- MONGOIZED --//
  created_at: Date; //-- MONGOIZED --//
  user_db_id: string;
  event: "grant_consent" | "withdraw_consent";
  agreements: IClickwrapAgreement[];
}

//-- Clickwrap User Status --//
export interface IClickwrapUserStatus {
  last_edited: string; //-- {MONGOIZE} Date --//
  user_db_id: string;
  activeAgreement: boolean;
  agreements: IClickwrapAgreement[];
}
export interface IClickwrapUserStatus_Mongo {
  last_edited: Date; //-- MONGOIZED --//
  user_db_id: string;
  activeAgreement: boolean;
  agreements: IClickwrapAgreement[];
}
