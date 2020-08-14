import { getLocationByDatasource } from './generateRequest';

const validateDatasource = (requestState) => {
  if (requestState.datasource) {
    if (requestState.datasource === 'CUSTOM' && requestState.dataFilterOptions[0].options.collectionId) {
      return true;
    }
    if (requestState.datasource === 'DATAFUSION') {
      return (
        getLocationByDatasource(requestState.datafusionSources[0].datasource) ===
        getLocationByDatasource(requestState.datafusionSources[1].datasource)
      );
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
