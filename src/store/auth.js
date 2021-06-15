import { createSlice } from '@reduxjs/toolkit';
import { setTokenState } from '../utils/configureAxios';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      userdata: null,
      access_token: null,
    },
    // For EDC Deployment. Assume it's true so feature get toggled and not dissapear.
    isEDC: true,
    isImpersonating: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user.userdata = action.payload.userdata;
      state.user.access_token = action.payload.access_token;
      state.user.expires_in = action.payload.expires_in;
      setTokenState(action.payload.access_token, action.payload.expires_in);
    },
    resetUser: (state, action) => {
      state.user.userdata = null;
      state.user.access_token = null;
      state.user.expires_in = null;
      setTokenState('', null);
    },
    setIsEDC: (state, action) => {
      state.isEDC = action.payload;
    },
    setToken: (state, action) => {
      state.user.access_token = action.payload.access_token;
      state.user.expires_in = action.payload.expires_in;
    },
    setIsImpersonating: (state) => {
      state.isImpersonating = true;
    },
  },
});

export default authSlice;
