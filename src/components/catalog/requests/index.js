import Axios from 'axios';
import bbox from '@turf/bbox';
import { getUrlFromCurl, getRequestBody } from '../../process/requests/parseRequest';
import { S2L1C, S1GRD, S2L2A } from '../../../utils/const';
import { datasourceToCollection } from '../const';
import { isBbox } from '../../common/Map/utils/crsTransform';

const getConfigHelper = (token, reqConfig) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
};

const CATALOG_BASE_URL = 'https://services.sentinel-hub.com/api/v1/catalog/';

export const getCatalogCollections = (token, reqConfig) => {
  const config = getConfigHelper(token, reqConfig);
  const url = CATALOG_BASE_URL + 'collections';
  return Axios.get(url, config);
};

const getBbox = (geometry) => {
  if (isBbox(geometry)) {
    return geometry;
  }
  return bbox(geometry);
};

const shouldIntersect = (geometry) => !isBbox(geometry);

const getDateTime = (catalogState, timeRange) => {
  if (catalogState.isTimeFromOpen && catalogState.isTimeToOpen) {
    return `../..`;
  }
  if (catalogState.isTimeFromOpen) {
    return `../${timeRange.timeTo}`;
  } else if (catalogState.isTimeToOpen) {
    return `${timeRange.timeFrom}/..`;
  }
  return timeRange.timeFrom + '/' + timeRange.timeTo;
};

const getCatalogQueries = (catalogState) => {
  let queryObj = {};
  for (let query of catalogState.queryProperties) {
    queryObj[query.propertyName] = {
      [query.operator]: query.propertyValue,
    };
  }
  return queryObj;
};

const getCatalogFields = (catalogState) => {
  const fields = {};

  if (!catalogState.disableInclude) {
    fields.include = catalogState.includeFields;
  }
  if (!catalogState.disableExclude) {
    fields.exclude = catalogState.excludeFields;
  }

  return fields;
};

export const getCatalogRequestBody = (catalogState, geometry, timeRange) => {
  const body = {};
  body.collections = [catalogState.selectedCollection];
  body.datetime = getDateTime(catalogState, timeRange);
  if (shouldIntersect(geometry)) {
    body.intersects = geometry;
  } else {
    body.bbox = getBbox(geometry);
  }
  if (catalogState.limit) {
    body.limit = parseInt(catalogState.limit);
  }
  if (catalogState.distinct) {
    body.distinct = catalogState.distinct;
  }
  if (catalogState.queryProperties.length > 0) {
    body.query = {
      ...getCatalogQueries(catalogState),
    };
  }
  if (!catalogState.disableInclude || !catalogState.disableExclude) {
    body.fields = {
      ...getCatalogFields(catalogState),
    };
  }

  return body;
};

export const generateCatalogRequest = (catalogState, geometry, timeRange, token, next = 0, reqConfig) => {
  const body = getCatalogRequestBody(catalogState, geometry, timeRange);
  const config = getConfigHelper(token, reqConfig);
  const url = CATALOG_BASE_URL + 'search';

  if (next) {
    body.next = next;
  }

  return Axios.post(url, body, config);
};

export const generateCatalogCurlCommand = (catalogState, geometry, timeRange, token) => {
  const url = CATALOG_BASE_URL + 'search';
  const body = JSON.stringify(getCatalogRequestBody(catalogState, geometry, timeRange), null, 2);
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;
  return curlCommand;
};

export const sendCatalogEditedRequest = (text, token, reqConfig) => {
  try {
    const url = getUrlFromCurl(text);
    const parsed = JSON.parse(getRequestBody(text));
    const config = getConfigHelper(token, reqConfig);
    return Axios.post(url, parsed, config);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const fetchAvailableDatesWithCatalog = async (datasource, timerange, geometry, token, reqConfig) => {
  const url = CATALOG_BASE_URL + 'search';
  const body = {};
  const config = getConfigHelper(token, reqConfig);
  if (datasource === S2L1C || datasource === S2L2A || datasource === S1GRD) {
    body.collections = [datasourceToCollection[datasource]];
    body.datetime = timerange.timeFrom + '/' + timerange.timeTo;
    body.distinct = 'date';
    body.limit = 100;
    if (shouldIntersect(geometry)) {
      body.intersects = geometry;
    } else {
      body.bbox = getBbox(geometry);
    }
    return Axios.post(url, body, config);
  } else {
    return new Promise((resolve, reject) => {
      resolve({ data: { features: [] } });
    });
  }
};

export const fetchBoundsWithCatalog = (collectionId, collectionType, token, reqConfig) => {
  const url = `${CATALOG_BASE_URL}search?bbox=-180,-90,180,90&collections=${collectionType.toLowerCase()}-${collectionId}`;
  const config = getConfigHelper(token, reqConfig);
  return Axios.get(url, config);
};
