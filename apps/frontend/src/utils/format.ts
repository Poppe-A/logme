export const capitalizeFirstLetter = (string: string) => {
  if (string && string.length) {
    return string.replace(/^./, string[0].toUpperCase());
  }
  return string;
};
