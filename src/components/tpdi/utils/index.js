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

export const isAirbus = (constellation) => ['AIRBUS_SPOT', 'AIRBUS_PHR'].includes(constellation);

export const stateConstellationToConstellation = {
  AIRBUS_SPOT: 'SPOT',
  AIRBUS_PHR: 'PHR',
};

export const constellationToStateConstellation = {
  SPOT: 'AIRBUS_SPOT',
  PHR: 'AIRBUS_PHR',
};
