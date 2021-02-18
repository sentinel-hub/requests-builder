import { createSlice } from '@reduxjs/toolkit';

const savedRequestsSlice = createSlice({
  name: 'savedRequests',
  initialState: {
    savedRequests: [],
  },
  reducers: {
    appendRequest: (state, action) => {
      state.savedRequests = [{ ...action.payload, creationTime: Date.now() }, ...state.savedRequests];
    },
  },
});

export default savedRequestsSlice;
