const validateDatasource = (requestState) => {
  return Boolean(
    requestState.datasource &&
      ((requestState.datasource === 'CUSTOM' &&
        requestState.byocCollectionId &&
        requestState.byocLocation &&
        requestState.byocCollectionType) ||
        requestState.datasource !== 'CUSTOM'),
  );
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
