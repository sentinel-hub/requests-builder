import { createSlice } from '@reduxjs/toolkit';

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    isTimeToOpen: false,
    isTimeFromOpen: false,
    selectedCollection: '',
    queryProperties: [],
    limit: 10,
    next: '',
    disableInclude: true,
    includeFields: [''],
    disableExclude: true,
    excludeFields: [''],
    distinct: '',
  },
  reducers: {
    openTimeFrom: (state, action) => {
      state.isTimeFromOpen = action.payload;
    },
    openTimeTo: (state, action) => {
      state.isTimeToOpen = action.payload;
    },
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
      state.queryProperties = [];
    },
    addQueryProperty: (state, action) => {
      state.queryProperties.push({
        propertyName: '',
        propertyValue: '',
        operator: '',
      });
    },
    removeQueryProperty: (state, action) => {
      let idx = action.payload;
      state.queryProperties = state.queryProperties
        .slice(0, idx)
        .concat(state.queryProperties.slice(idx + 1));
    },
    setQueryProperty: (state, action) => {
      let idx = action.payload.idx;
      if (action.payload.propertyName !== undefined) {
        state.queryProperties[idx] = {
          propertyName: action.payload.propertyName,
          propertyValue: '',
          operator: '',
        };
      }
      if (action.payload.propertyValue) {
        state.queryProperties[idx].propertyValue = action.payload.propertyValue;
      }
      if (action.payload.operator) {
        state.queryProperties[idx].operator = action.payload.operator;
      }
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    addIncludeField: (state) => {
      state.includeFields.push('');
    },
    addExcludeField: (state) => {
      state.excludeFields.push('');
    },
    deleteIncludeField: (state, action) => {
      const idx = action.payload;
      state.includeFields = state.includeFields.slice(0, idx).concat(state.includeFields.slice(idx + 1));
    },
    deleteExcludeField: (state, action) => {
      const idx = action.payload;
      state.excludeFields = state.excludeFields.slice(0, idx).concat(state.excludeFields.slice(idx + 1));
    },
    setIncludeField: (state, action) => {
      let idx = action.payload.idx;
      state.includeFields[idx] = action.payload.value;
    },
    setExcludeField: (state, action) => {
      let idx = action.payload.idx;
      state.excludeFields[idx] = action.payload.value;
    },
    setDisableIncludeFields: (state, action) => {
      state.disableInclude = action.payload;
    },
    setDisableExcludeFields: (state, action) => {
      state.disableExclude = action.payload;
    },
    setDistinct: (state, action) => {
      state.distinct = action.payload;
    },
    setNext: (state, action) => {
      state.next = action.payload;
    },
    // addSelectedCollection: (state, action) => {
    //   state.selectedCollections.push(action.payload);
    // },
    // removeFromSelectedCollections: (state, action) => {
    //   let idx = state.selectedCollections.indexOf(action.payload);
    //   state.selectedCollections = state.selectedCollections
    //     .slice(0, idx)
    //     .concat(state.selectedCollections.slice(idx + 1));
    // },
  },
});

export default catalogSlice;
