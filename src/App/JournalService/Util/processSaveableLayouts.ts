import { Layouts } from "react-grid-layout";

export const processSaveableLayouts = (
  saveableLayouts: Layouts,
  breakpoint: "md" | "sm",
  setUnsavedLayoutsChanges: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  // for the active breakpoint
  // compare each item by matching the "i" value
  // for each saved layout's properties, check if the saveableLayouts properties matches (because saved layouts are probably sparser than saveableLayouts)

  return;
};
