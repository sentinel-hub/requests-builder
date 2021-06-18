import { CUSTOM } from './const/const';

const validateDatasource = (requestState) => {
  return Boolean(
    requestState.datasource &&
      ((requestState.datasource === CUSTOM &&
        requestState.byocCollectionId &&
        requestState.byocLocation &&
        requestState.byocCollectionType) ||
        requestState.datasource !== CUSTOM),
  );
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
