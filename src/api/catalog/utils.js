import bbox from '@turf/bbox';
import { datasourceToCollection } from '../../components/catalog/const';
import { isBbox } from '../../components/common/Map/utils/crsTransform';

const shouldIntersect = (geometry) => !isBbox(geometry);

const getBbox = (geometry) => {
  if (isBbox(geometry)) {
    return geometry;
  }
  return bbox(geometry);
};

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

const getCatalogSearchByIdsBody = (catalogState) => {
  const body = {};
  body.collections = [catalogState.selectedCollection];
  body.ids = catalogState.ids;
  if (!catalogState.disableInclude || !catalogState.disableExclude) {
    body.fields = {
      ...getCatalogFields(catalogState),
    };
  }
  return body;
};

export const getCatalogRequestBody = (catalogState, geometry, timeRange, next = 0) => {
  const body = {};
  if (catalogState.isSearchingByIds) {
    return getCatalogSearchByIdsBody(catalogState);
  }
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

  if (next) {
    body.next = next;
  }

  return body;
};

export const getFetchDatesBody = (datasource, timerange, geometry) => {
  const collection = datasourceToCollection[datasource];
  const body = {};
  body.collections = [collection];
  body.datetime = timerange.timeFrom + '/' + timerange.timeTo;
  body.distinct = 'date';
  body.limit = 100;
  if (shouldIntersect(geometry)) {
    body.intersects = geometry;
  } else {
    body.bbox = getBbox(geometry);
  }
  return body;
};
