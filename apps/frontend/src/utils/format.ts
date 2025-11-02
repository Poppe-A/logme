export const capitalizeFirstLetter = (string: string) => {
  console.log('string', string); //todo remove
  return string.replace(/^./, string[0].toUpperCase());
};
