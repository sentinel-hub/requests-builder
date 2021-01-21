const validateDatasource = (requestState) => {
  if (requestState.datasource) {
    if (
      requestState.datasource === 'CUSTOM' &&
      requestState.byocCollectionId &&
      requestState.byocLocation &&
      requestState.byocCollectionType
    ) {
      return true;
    }
    if (requestState.datasource !== 'CUSTOM') {
      return true;
    }
  }
  return false;
};

export const validateRequestState = (requestState) => {
  try {
    const { width, height, evalscript, CRS, geometry } = requestState;
    const isDatasourceValid = validateDatasource(requestState);
    return !!(isDatasourceValid && width && height && evalscript && CRS && geometry);
  } catch (err) {
    return false;
  }
};
