import store from '../store';
import { CUSTOM, DATASOURCES } from '../utils/const/const';

export const DEFAULT_URL = 'https://services.sentinel-hub.com';

export const getBaseUrl = () => store.getState().params.url;
export const isOnDefaultUrl = () => getBaseUrl() === DEFAULT_URL;

const byocLocationToBaseUrl = (location) => {
  switch (location) {
    case 'aws-eu-central-1':
      return 'https://services.sentinel-hub.com/';
    case 'aws-us-west-2':
      return 'https://services-uswest2.sentinel-hub.com/';
    case 'creo':
      return 'https://creodias.sentinel-hub.com/';
    case 'codede':
      return 'https://code-de.sentinel-hub.com';
    default:
      return 'https://services.sentinel-hub.com/';
  }
};

const getUrlForCollection = (type, location, service) => {
  if (!isOnDefaultUrl()) {
    return getBaseUrl() + `/api/v1/${service}`;
  }
  if (type === CUSTOM) {
    return byocLocationToBaseUrl(location) + `api/v1/${service}`;
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
