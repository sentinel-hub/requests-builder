import { createSlice } from '@reduxjs/toolkit';

const paramsSlice = createSlice({
  name: 'params',
  initialState: {
    customUrl: undefined,
    extendedSettings: false,
  },
  reducers: {
    setCustomUrl: (state, action) => {
      state.customUrl = action.payload;
    },
    setExtendedSettings: (state) => {
      state.extendedSettings = true;
    },
  },
});

export default paramsSlice;
