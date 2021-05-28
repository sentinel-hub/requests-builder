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

export const isWritingDecimal = (input) => /^\d*(\.|,)0*$/.test(input);

export const validFloatInput = (text) => /^([0-9]*[.])?[0-9]+$/.test(text);

export const checkValidUuid = (id) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
