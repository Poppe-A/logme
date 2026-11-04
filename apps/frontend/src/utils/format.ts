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

export const shortLocale = {
  formatDistance: (token: string, count: number) => {
    const units: Record<string, string> = {
      xYears: 'a',
      xMonths: 'mois',
      xWeeks: 'sem',
      xDays: 'j',
      xHours: 'h',
      xMinutes: 'min',
      xSeconds: 's',
    };
    return token === 'xHours' ? `${count} h` : `${count} ${units[token]}`;
  },
};
// https://youtu.be/drBjruu28Lw?is=6UbEvWSzHoQ1uDNv
// (?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/\s]{11})

export const getVideoIdFromYoutubeUrl = (url: string) => {
  const regexp: RegExp = new RegExp(
    '(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/\s]{11})',
    'i',
  );

  const matches = url.match(regexp);
  if (matches?.length) {
    return matches?.length ? matches[1] : null;
  }
};
