export const parseToBool = (str: string): boolean | undefined => {
  if (str === "true") {
    return true;
  } else if (str === "false") {
    return false;
  } else {
    return undefined;
  }
};
