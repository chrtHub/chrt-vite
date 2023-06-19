export const isValidJournalLayoutUrlName = (urlName: string): boolean => {
  //-- Allows letters, numbers, hyphens, and underscores --//
  const pattern = /^[a-zA-Z0-9-_]+$/;
  return pattern.test(urlName);
};
