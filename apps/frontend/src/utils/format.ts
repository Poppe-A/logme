export const capitalizeFirstLetter = (string: string) => {
  console.log('string', string); //todo remove
  if (string && string.length) {
    return string.replace(/^./, string[0].toUpperCase());
  }
  return string;
};
