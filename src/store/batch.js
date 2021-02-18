import { createSlice } from '@reduxjs/toolkit';

const batchInitialState = {
  tillingGrid: 0,
  resolution: 10,
  description: '',
  bucketName: '',
  selectedBatchId: '',
  cogOutput: false,
  defaultTilePath: '',
  // bucketName -> true, if defaultTilePath -> false
  specifyingBucketName: true,
  extraInfo: '',
  specifyingCogParams: false,
  overviewLevels: '',
  overviewMinSize: '',
  blockxsize: '',
  blockysize: '',
  createCollection: false,
  collectionId: '',
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
    setSelectedBatchId: (state, action) => {
      state.selectedBatchId = action.payload;
    },
    setCogOutput: (state, action) => {
      state.cogOutput = action.payload;
    },
    setDefaultTilePath: (state, action) => {
      state.defaultTilePath = action.payload;
    },
    setSpecifyingBucketName: (state, action) => {
      state.specifyingBucketName = action.payload;
    },
    setExtraInfo: (state, action) => {
      state.extraInfo = action.payload;
    },
    setOverviewLevels: (state, action) => {
      state.overviewLevels = action.payload;
    },
    setOverviewMinSize: (state, action) => {
      state.overviewMinSize = action.payload;
    },
    setBlockxsize: (state, action) => {
      state.blockxsize = action.payload;
    },
    setBlockysize: (state, action) => {
      state.blockysize = action.payload;
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
  },
});

export default batchSlice;
