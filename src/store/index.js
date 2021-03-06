import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import alertSlice from './alert';
import authSlice from './auth';
import batchSlice from './batch';
import catalogSlice from './catalog';
import mapSlice from './map';
import paramsSlice from './params';
import requestSlice from './request';
import responsesSlice from './responses';
import savedRequestsSlice from './savedRequests';
import statisticalSlice from './statistical';
import tpdiSlice, { airbusSlice, maxarSlice, planetSlice } from './tpdi';
import wmsSlice from './wms';

const asyncDispatchMiddleware = (store) => (next) => (action) => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach((a) => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch = Object.assign({}, action, { asyncDispatch });

  const res = next(actionWithAsyncDispatch);

  syncActivityFinished = true;
  flushQueue();

  return res;
};

const reducers = combineReducers({
  auth: authSlice.reducer,
  request: requestSlice.reducer,
  map: mapSlice.reducer,
  batch: batchSlice.reducer,
  tpdi: tpdiSlice.reducer,
  airbus: airbusSlice.reducer,
  planet: planetSlice.reducer,
  maxar: maxarSlice.reducer,
  alert: alertSlice.reducer,
  wms: wmsSlice.reducer,
  response: responsesSlice.reducer,
  catalog: catalogSlice.reducer,
  params: paramsSlice.reducer,
  statistical: statisticalSlice.reducer,
  savedRequests: savedRequestsSlice.reducer,
});

const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: ['map.additionalLayers', 'response.imageResponse'],
      ignoredActionPaths: ['payload.arrayBuffer'],
    },
  }).concat(asyncDispatchMiddleware),
});

export default store;
