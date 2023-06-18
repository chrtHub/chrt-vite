import { Layouts } from "react-grid-layout";

export const processSaveableLayouts = (
  breakpoint: "md" | "sm",
  layouts: Layouts,
  saveableLayouts: Layouts,
  setUnsavedLayoutsChanges: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  //-- For each saved layout's properties, check if the saveableLayouts properties matches (because saved layouts are probably sparser than saveableLayouts, so checking in the opposite direction will cause "same" object to look different since we just want to check the properties defined in saved ILayoutsOption objects) --//

  const existing = layouts[breakpoint];
  const saveable = saveableLayouts[breakpoint];

  if (!existing || !saveable) {
    console.error("Missing layouts for the specified breakpoint");
    return;
  }

  for (const existingLayout of existing) {
    const saveableLayout = saveable.find((item) => item.i === existingLayout.i);

    if (saveableLayout) {
      if (
        existingLayout.x != saveableLayout.x ||
        existingLayout.y != saveableLayout.y ||
        existingLayout.w != saveableLayout.w ||
        existingLayout.h != saveableLayout.h ||
        existingLayout.minW != saveableLayout.minW ||
        existingLayout.minH != saveableLayout.minH
      ) {
        setUnsavedLayoutsChanges(true);
        return;
      } else {
        setUnsavedLayoutsChanges(false);
      }
    } else {
      // setUnsavedLayoutsChanges(true); // DEV - is this needed here? What about when an item is added to the grid?
      console.error(`Saveable layout item '${existingLayout.i}' not found.`);
    }
  }

  return;
};
