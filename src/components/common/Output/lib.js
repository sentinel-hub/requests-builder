export const shouldDisplayDimensions = (heightOrRes, isOnAutoRes) =>
  heightOrRes === 'HEIGHT' || (isOnAutoRes === true && heightOrRes === 'RES');
