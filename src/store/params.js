import { createSlice } from '@reduxjs/toolkit';

const paramsSlice = createSlice({
  name: 'params',
  initialState: {
    enableStatisticsApi: false,
    customUrl: undefined,
  },
  reducers: {
    setEnableStatisticsApi: (state, action) => {
      state.enableStatisticsApi = action.payload;
    },
    setCustomUrl: (state, action) => {
      state.customUrl = action.payload;
    },
  },
});

export default paramsSlice;
