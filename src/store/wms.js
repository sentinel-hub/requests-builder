import { createSlice } from '@reduxjs/toolkit';

const wmsSlice = createSlice({
  name: 'wms',
  initialState: {
    instanceId: '',
    layerId: '',
    datasource: '',
    mode: 'WMS',
    advancedOptions: {},
  },
  reducers: {
    setInstanceId: (state, action) => {
      state.instanceId = action.payload;
    },
    setLayerId: (state, action) => {
      state.layerId = action.payload;
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
  },
});

export default wmsSlice;
