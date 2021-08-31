import { createSlice } from '@reduxjs/toolkit';

const iniImageResponse = {
  src: undefined,
  format: undefined,
  wgs84Geometry: undefined,
  width: undefined,
  height: undefined,
  shouldDisplayDimensions: undefined,
  arrayBuffer: undefined,
};

const responsesSlice = createSlice({
  name: 'response',
  initialState: {
    displayResponse: false,
    error: '',
    imageResponse: iniImageResponse,
    fisResponse: '',
    stringRequest: undefined,
    mode: undefined,
    isFromCollections: undefined,
    wfsResponse: undefined,
  },
  reducers: {
    setDisplayResponse: (state, action) => {
      // reset state when close modal.
      if (action.payload === false) {
        state.error = '';
        state.fisResponse = '';
        state.stringRequest = undefined;
        state.isFromCollections = undefined;
        state.imageResponse = iniImageResponse;
        state.mode = undefined;
        state.wfsResponse = undefined;
      }
      state.displayResponse = action.payload;
    },
    setImageResponse: (state, action) => {
      const {
        src,
        format,
        wgs84Geometry,
        isFromCollections,
        mode,
        stringRequest,
        displayResponse,
        dimensions,
        arrayBuffer,
      } = action.payload;
      state.imageResponse = {
        src,
        format,
        wgs84Geometry,
        dimensions,
        arrayBuffer,
      };
      if (isFromCollections !== undefined) {
        state.isFromCollections = isFromCollections;
      }
      if (mode !== undefined) {
        state.mode = mode;
      }
      if (stringRequest !== undefined) {
        state.stringRequest = stringRequest;
      }
      if (displayResponse !== undefined) {
        state.displayResponse = displayResponse;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.displayResponse = true;
    },
    setFisResponse: (state, action) => {
      const { response, stringRequest, mode, displayResponse, isFromCollections } = action.payload;
      state.fisResponse = response;
      state.stringRequest = stringRequest;
      state.mode = mode;
      state.displayResponse = displayResponse;
      state.isFromCollections = isFromCollections;
    },
    setWfsResponse: (state, action) => {
      state.wfsResponse = action.payload;
    },
  },
});

export default responsesSlice;
