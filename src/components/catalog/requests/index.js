import Axios from 'axios';
import bbox from '@turf/bbox';

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
  if (geometry.length === 4) {
    return geometry;
  }
  return bbox(geometry);
};

const shouldIntersect = (geometry) => {
  if (geometry.length === 4) {
    return false;
  }
  return true;
};

const getDateTime = (catalogState) => {
  if (catalogState.timeFrom.isOpen) {
    return `../${catalogState.timeFrom.time}`;
  } else if (catalogState.timeTo.isOpen) {
    return `${catalogState.timeTo.time}/..`;
  }
  return catalogState.timeFrom.time + '/' + catalogState.timeTo.time;
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

export const getCatalogRequestBody = (catalogState, geometry) => {
  const body = {};
  body.collections = [catalogState.selectedCollection];
  body.datetime = getDateTime(catalogState);
  if (shouldIntersect(geometry)) {
    body.intersects = geometry;
  } else {
    body.bbox = getBbox(geometry);
  }
  body.limit = catalogState.limit;
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

export const generateCatalogRequest = (catalogState, geometry, token, next = 0, reqConfig) => {
  const body = getCatalogRequestBody(catalogState, geometry);
  const config = getConfigHelper(token, reqConfig);
  const url = CATALOG_BASE_URL + 'search';

  if (next) {
    body.next = next;
  }

  return Axios.post(url, body, config);
};

export const generateCatalogCurlCommand = (catalogState, geometry, token) => {
  const url = CATALOG_BASE_URL + 'search';
  const body = JSON.stringify(getCatalogRequestBody(catalogState, geometry), null, 2);
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;
  return curlCommand;
};
