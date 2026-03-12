export const capitalizeFirstLetter = (string: string) => {
  if (string && string.length) {
    return string.replace(/^./, string[0].toUpperCase());
  }
  return string;
};

export const removeLastsNullDecimals = (value: string) => {
  const decimalPart = Array.from(value.split('.')[1]);
  if (!decimalPart.some(digit => digit !== '0')) {
    return value.split('.')[0];
  } else if (decimalPart[decimalPart.length - 1] === '0') {
    const firstDecimalDigit = decimalPart[0];
    return `${value.split('.')[0]}.${firstDecimalDigit}`;
  }
  return value;
};
