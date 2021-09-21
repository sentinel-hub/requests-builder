import { createSlice } from '@reduxjs/toolkit';
import { uuidv4 } from './alert';

// collection: { collectionName: string, requests: Request[] }

const savedRequestsSlice = createSlice({
  name: 'savedRequests',
  initialState: {
    savedRequests: [],
    expandedSidebar: false,
  },
  reducers: {
    appendRequest: (state, action) => {
      const { primaryKey, request, collectionName } = action.payload;
      const updateIdx = state.savedRequests.findIndex((col) => col.primaryKey === primaryKey);
      let updatedCollection;
      if (updateIdx !== -1) {
        updatedCollection = {
          ...state.savedRequests[updateIdx],
          requests: [request, ...state.savedRequests[updateIdx].requests],
        };
        state.savedRequests = state.savedRequests
          .slice(0, updateIdx)
          .concat(updatedCollection)
          .concat(state.savedRequests.slice(updateIdx + 1));
      }
      // new collection
      else {
        updatedCollection = {
          collectionName,
          primaryKey: uuidv4(),
          requests: [request],
        };
        state.savedRequests = [updatedCollection, ...state.savedRequests];
      }
    },
    deleteRequest: (state, action) => {
      const { primaryKey, idx } = action.payload;
      const updateIdx = state.savedRequests.findIndex((col) => col.primaryKey === primaryKey);
      state.savedRequests[updateIdx].requests = state.savedRequests[updateIdx].requests
        .slice(0, idx)
        .concat(state.savedRequests[updateIdx].requests.slice(idx + 1));
    },
    appendCollection: (state, action) => {
      const { collection } = action.payload;
      state.savedRequests = [collection, ...state.savedRequests];
    },
    addOldFormatCollection: (state, action) => {
      state.expandedSidebar = true;
      const withPrimaryKey = { ...action.payload, primaryKey: uuidv4() };
      state.savedRequests = [withPrimaryKey, ...state.savedRequests];
    },
    removeCollection: (state, action) => {
      const { primaryKey } = action.payload;
      const idx = state.savedRequests.findIndex((col) => col.primaryKey === primaryKey);
      if (idx !== -1) {
        state.savedRequests = state.savedRequests.slice(0, idx).concat(state.savedRequests.slice(idx + 1));
      }
    },
    setCollection: (state, action) => {
      const { primaryKey } = action.payload.collection;
      const idx = state.savedRequests.findIndex((collection) => collection.primaryKey === primaryKey);
      if (idx !== -1) {
        state.savedRequests[idx] = action.payload.collection;
      }
    },
    setCollections: (state, action) => {
      state.savedRequests = action.payload;
    },
    setExpandedSidebar: (state, action) => {
      state.expandedSidebar = action.payload;
    },
    setResponse: (state, action) => {
      const { idx, response, primaryKey } = action.payload;
      const collectionToModify = state.savedRequests.find((col) => col.primaryKey === primaryKey);
      if (collectionToModify) {
        collectionToModify.requests[idx].response = response;
      }
    },
    setCollectionName: (state, action) => {
      const { collectionName, newName } = action.payload;
      const collectionToUpate = state.savedRequests.find((col) => col.collectionName === collectionName);
      collectionToUpate.collectionName = newName;
    },
  },
});

export default savedRequestsSlice;
