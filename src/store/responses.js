import { createSlice } from '@reduxjs/toolkit';

const responsesSlice = createSlice({
  name: 'response',
  initialState: {
    src: '',
    show: false,
    dimensions: [],
    error: '',
    fisResponse: '',
    isTar: false,
    request: undefined,
    mode: undefined,
  },
  reducers: {
    setResponseUrl: (state, action) => {
      state.src = action.payload;
    },
    setShow: (state, action) => {
      // reset state when close modal.
      if (!action.payload) {
        state.src = '';
        state.dimensions = [];
        state.error = '';
        state.fisResponse = '';
        state.isTar = false;
        state.mode = undefined;
        state.request = undefined;
      }
      state.show = action.payload;
    },
    setDimensions: (state, action) => {
      state.dimensions = action.payload;
    },
    setResponse: (state, action) => {
      state.src = action.payload.src;
      state.show = true;
      state.isTar = action.payload.isTar;
      if (action.payload.dimensions) {
        state.dimensions = action.payload.dimensions;
      }
      if (action.payload.request) {
        state.request = action.payload.request;
      }
      if (action.payload.mode) {
        state.mode = action.payload.mode;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFisResponse: (state, action) => {
      state.fisResponse = action.payload;
    },
  },
});

export default responsesSlice;
