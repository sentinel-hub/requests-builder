import { createSlice } from '@reduxjs/toolkit';

const batchInitialState = {
  tillingGrid: 0,
  resolution: 10,
  description: '',
  bucketName: '',
  cogOutput: false,
  defaultTilePath: '',
  // bucketName -> true, if defaultTilePath -> false
  extraInfo: '',
  specifyingCogParams: false,
  createCollection: false,
  collectionId: '',
  cogParameters: {},
  overwrite: false,
};

const batchSlice = createSlice({
  name: 'batch',
  initialState: batchInitialState,
  reducers: {
    setTillingGrid: (state, action) => {
      state.tillingGrid = action.payload;
    },
    setResolution: (state, action) => {
      state.resolution = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setBucketName: (state, action) => {
      state.bucketName = action.payload;
    },
    setCogOutput: (state, action) => {
      state.cogOutput = action.payload;
    },
    setDefaultTilePath: (state, action) => {
      state.defaultTilePath = action.payload;
    },
    setExtraInfo: (state, action) => {
      state.extraInfo = action.payload;
    },
    setCreateCollection: (state, action) => {
      state.createCollection = action.payload;
    },
    setCollectionId: (state, action) => {
      state.collectionId = action.payload;
    },
    setSpecifyingCogParams: (state, action) => {
      state.specifyingCogParams = action.payload;
    },
    resetBatchState: (state) => {
      state = batchInitialState;
    },
    setCogParameter: (state, action) => {
      const { key, value } = action.payload;
      state.cogParameters[key] = value;
    },
    setCogParametersAbsolute: (state, action) => {
      state.cogParameters = action.payload;
    },
    setOverwrite: (state, action) => {
      state.overwrite = action.payload;
    },
  },
});

export default batchSlice;
