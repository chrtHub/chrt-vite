import { v4 as uuidv4 } from "uuid";

import { UUIDV4 } from "../App/GPT/chatson/chatson_types";

//-- Regex test and format ---//
function isUUIDV4(uuid: string): uuid is UUIDV4 {
  return uuidv4Regex.test(uuid);
}
//-- UUIDv4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx --//
//-- where x is any hexadecimal digit and y is one of 8, 9, A, or B --//
const uuidv4Regex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

//-- Validate uuidv4 --//
export function isValidUUIDV4(uuid: string): UUIDV4 {
  if (uuidv4Regex.test(uuid)) {
    return uuid as UUIDV4;
  }
  throw new Error("invalid uuidv4");
}

//-- Generate uuidv4 --//
export function getUUIDV4(type?: "dummy"): UUIDV4 {
  const dummy_uuid = "00000000-0000-4000-A000-000000000000";

  let uuid;
  if (type === "dummy") {
    uuid = dummy_uuid;
  } else {
    uuid = uuidv4();
  }

  if (isUUIDV4(uuid)) {
    return uuid;
  }

  throw new Error("invalid uuidv4");
}
