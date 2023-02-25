//-- File downloads --//
import { saveAs } from "file-saver";

let blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });
saveAs(blob, selectedFilename);

let fileDataAsString = await res.Body.transformToString();
