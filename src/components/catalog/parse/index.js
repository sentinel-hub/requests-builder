import { getRequestBody } from '../../process/requests/parseRequest';
import store, { catalogSlice, requestSlice } from '../../../store';

export const parseCatalogBody = (str) => {
  let body = getRequestBody(str);
  const parsedJson = JSON.parse(body);
  dispatchCatalogChanges(parsedJson);
};

const dispatchCatalogChanges = (parsedJson) => {
  if (parsedJson.datetime) {
    dispatchDateTime(parsedJson.datetime);
  }
  if (parsedJson.collections && parsedJson.collections[0]) {
    store.dispatch(catalogSlice.actions.setSelectedCollection(parsedJson.collections[0]));
  }
  if (parsedJson.bbox) {
    store.dispatch(requestSlice.actions.setGeometry(parsedJson.bbox));
  }
  if (parsedJson.intersects) {
    store.dispatch(requestSlice.actions.setGeometry(parsedJson.intersects));
  }
  if (typeof parsedJson.limit === 'number') {
    store.dispatch(catalogSlice.actions.setLimit(parsedJson.limit));
  }
  if (typeof parsedJson.next === 'number') {
    store.dispatch(catalogSlice.actions.setNext(parsedJson.next));
  }
  if (parsedJson.query && Object.keys(parsedJson.query).length > 0) {
    dispatchQuery(parsedJson.query);
  }
  if (parsedJson.distinct) {
    store.dispatch(catalogSlice.actions.setDistinct(parsedJson.distinct));
  }
  if (parsedJson.fields) {
    dispatchFields(parsedJson.fields);
  }
};

const dispatchDateTime = (datetime) => {
  const [from, to] = datetime.split('/');
  if (from === '..') {
    store.dispatch(catalogSlice.actions.openTimeFrom(true));
  } else if (to === '..') {
    store.dispatch(catalogSlice.actions.openTimeTo(true));
  }

  if (from && from !== '..') {
    store.dispatch(catalogSlice.actions.setTimeFrom(from));
  }
  if (to && to !== '..') {
    store.dispatch(catalogSlice.actions.setTimeTo(to));
  }
};

const dispatchQuery = (query) => {
  let keys = Object.keys(query);
  for (let i = 0; i < keys.length; i++) {
    store.dispatch(catalogSlice.actions.addQueryProperty());
    let q = query[keys[i]];
    let operator = Object.keys(q)[0];
    let value = q[operator];
    store.dispatch(
      catalogSlice.actions.setQueryProperty({
        propertyName: keys[i],
        operator,
        propertyValue: value,
        idx: i,
      }),
    );
  }
};

const dispatchFields = (fields) => {
  if (fields.include && fields.include.length > 0) {
    store.dispatch(catalogSlice.actions.setDisableIncludeFields(false));
    for (let i = 0; i < fields.include.length; i++) {
      // First field is already in.
      if (i !== 0) {
        store.dispatch(catalogSlice.actions.addIncludeField());
      }
      store.dispatch(catalogSlice.actions.setIncludeField({ idx: i, value: fields.include[i] }));
    }
  }
  if (fields.exclude && fields.exclude.length > 0) {
    store.dispatch(catalogSlice.actions.setDisableExcludeFields(false));
    for (let i = 0; i < fields.exclude.length; i++) {
      if (i !== 0) {
        store.dispatch(catalogSlice.actions.addExcludeField());
      }
      store.dispatch(catalogSlice.actions.setExcludeField({ idx: i, value: fields.exclude[i] }));
    }
  }
};
