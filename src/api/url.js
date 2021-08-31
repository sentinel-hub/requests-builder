import store from '../store';
import { CUSTOM, DATASOURCES, getBaseUrlByDeployment } from '../utils/const/const';

export const DEFAULT_URL = 'https://services.sentinel-hub.com';

export const getBaseUrl = () => store.getState().params.url;
export const isOnDefaultUrl = () => getBaseUrl() === DEFAULT_URL;

const getUrlForCollection = (type, location, service) => {
  if (!isOnDefaultUrl()) {
    return getBaseUrl() + `/api/v1/${service}`;
  }
  if (type === CUSTOM) {
    return getBaseUrlByDeployment(location) + `api/v1/${service}`;
  }
  // on default
  return DATASOURCES[type].url + `/${service}`;
};

export const getProcessUrl = (requestState) =>
  getUrlForCollection(
    requestState.dataCollections[0].type,
    requestState.dataCollections[0].byocCollectionLocation,
    'process',
  );

export const getStatisticalUrl = (dataCollection) => {
  return getUrlForCollection(dataCollection.type, dataCollection.byocCollectionLocation, 'statistics');
};

export const getBatchUrl = (requestState) =>
  getUrlForCollection(
    requestState.dataCollections[0].type,
    requestState.dataCollections[0].byocCollectionLocation,
    'batch',
  );
