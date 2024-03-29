import { createSlice } from '@reduxjs/toolkit';

const wmsSlice = createSlice({
  name: 'wms',
  initialState: {
    instanceId: '',
    layer: {},
    datasource: '',
    byocCollection: undefined,
    byocCollectionType: undefined,
    mode: 'WMS',
    shouldFetchLayers: false,
    advancedOptions: {},
  },
  reducers: {
    setInstanceId: (state, action) => {
      state.instanceId = action.payload;
    },
    setLayer: (state, action) => {
      state.layer = action.payload;
    },
    setDatasource: (state, action) => {
      state.datasource = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setAdvancedOptions: (state, action) => {
      state.advancedOptions = { ...state.advancedOptions, ...action.payload };
    },
    resetAdvancedOptions: (state) => {
      state.advancedOptions = {};
    },
    setShouldFetchLayers: (state, action) => {
      state.shouldFetchLayers = action.payload;
    },
    setByocCollection: (state, action) => {
      state.byocCollection = action.payload.id;
      state.byocCollectionType = action.payload.type;
    },
  },
});

export default wmsSlice;
