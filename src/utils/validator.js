const validateDatasource = (requestState) => {
  return true;
};

export const validateRequestState = (requestState) => {
  try {
    const { width, height, evalscript } = requestState;
    const isDatasourceValid = validateDatasource(requestState);
    return !!(isDatasourceValid && width && height && evalscript);
  } catch (err) {
    return false;
  }
};
