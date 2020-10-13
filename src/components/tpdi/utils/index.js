export const getFormattedDatetime = (date) => {
  try {
    return date
      .split('T')
      .map((a) => a.split('.')[0])
      .join(' - ');
  } catch (err) {
    return date;
  }
};
