import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import dynamicMiddlewares from 'redux-dynamic-middlewares';

import alertSlice from './alert';
import authSlice from './auth';
import batchSlice from './batch';
import catalogSlice from './catalog';
import mapSlice from './map';
import { asyncDispatchMiddleware } from './middleware';
import modalSlice from './modal';
import paramsSlice from './params';
import requestSlice from './request';
import responsesSlice from './responses';
import savedRequestsSlice from './savedRequests';
import statisticalSlice from './statistical';
import tpdiSlice, { airbusSlice, maxarSlice, planetSlice } from './tpdi';
import wmsSlice from './wms';

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
  modal: modalSlice.reducer,
});

const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: ['map.additionalLayers', 'response.imageResponse', 'modal.onConfirm', 'modal.content'],
      ignoredActionPaths: ['payload.arrayBuffer'],
      ignoredActions: ['modal/openModal'],
    },
  }).concat([asyncDispatchMiddleware, dynamicMiddlewares]),
});

export default store;
