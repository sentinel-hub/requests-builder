import store from '../../../store';
import catalogSlice from '../../../store/catalog';
import requestSlice from '../../../store/request';
import mapSlice from '../../../store/map';
import { addSuccessAlert, addWarningAlert } from '../../../store/alert';
import { getRequestBody } from '../../process/requests/parseRequest';

export const parseCatalogBody = (str) => {
  let body = getRequestBody(str);
  try {
    const parsedJson = JSON.parse(body);
    dispatchCatalogChanges(parsedJson);
    addSuccessAlert('Request parsed successfully!');
  } catch (err) {
    addWarningAlert(
      'Something went wrong while parsing.\nRemember that only the body of the request and the generated curl commands by the app can be parsed.',
    );
    console.error(err);
  }
};

const dispatchCatalogChanges = (parsedJson) => {
  if (parsedJson.datetime) {
    dispatchDateTime(parsedJson.datetime);
  }
  if (parsedJson.collections && parsedJson.collections[0]) {
    store.dispatch(catalogSlice.actions.setSelectedCollection(parsedJson.collections[0]));
  }
  if (parsedJson.bbox) {
    store.dispatch(mapSlice.actions.setTextGeometry(parsedJson.bbox));
  }
  if (parsedJson.intersects) {
    store.dispatch(mapSlice.actions.setTextGeometry(parsedJson.intersects));
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
  if (parsedJson.ids && parsedJson.ids.length > 0) {
    store.dispatch(catalogSlice.actions.setIsSearchingByIds(true));
    store.dispatch(catalogSlice.actions.setIds(parsedJson.ids));
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
    store.dispatch(requestSlice.actions.setTimeFrom({ timeFrom: from, idx: 0 }));
  }
  if (to && to !== '..') {
    store.dispatch(requestSlice.actions.setTimeTo({ timeTo: to, idx: 0 }));
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
