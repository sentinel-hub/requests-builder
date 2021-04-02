import { createSlice } from '@reduxjs/toolkit';

const paramsSlice = createSlice({
  name: 'params',
  initialState: {
    customUrl: undefined,
  },
  reducers: {
    setCustomUrl: (state, action) => {
      state.customUrl = action.payload;
    },
  },
});

export default paramsSlice;
