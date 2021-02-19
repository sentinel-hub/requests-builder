import { createSlice } from '@reduxjs/toolkit';

const savedRequestsSlice = createSlice({
  name: 'savedRequests',
  initialState: {
    savedRequests: [],
    expandedSidebar: false,
  },
  reducers: {
    appendRequest: (state, action) => {
      state.savedRequests = [{ ...action.payload, creationTime: Date.now() }, ...state.savedRequests];
    },
    setCollection: (state, action) => {
      state.expandedSidebar = true;
      state.savedRequests = action.payload;
    },
    setExpandedSidebar: (state, action) => {
      state.expandedSidebar = action.payload;
    },
    setResponse: (state, action) => {
      const { idx, responseUrl } = action.payload;
      state.savedRequests[idx].response = responseUrl;
    },
  },
});

export default savedRequestsSlice;
