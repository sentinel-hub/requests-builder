// Number between 0-1 to XX%
export const formatPercentage = (number) => (number * 100).toFixed(1) + '%';

// AIRBUS PLEIADES -> Airbus Pleiades
export const formatText = (text) => {
  return text
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};
