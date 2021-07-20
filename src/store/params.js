import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_URL } from '../api/url';

const paramsSlice = createSlice({
  name: 'params',
  initialState: {
    url: DEFAULT_URL,
    extendedSettings: false,
    oauthUrl: undefined,
  },
  reducers: {
    setUrl: (state, action) => {
      const url = action.payload;
      if (url.charAt(url.length - 1) === '/') {
        state.url = url.slice(0, -1);
      } else {
        state.url = url;
      }
    },
    setExtendedSettings: (state) => {
      state.extendedSettings = true;
    },
    setOAuthUrl: (state, action) => {
      const url = action.payload;
      if (url.charAt(url.length - 1) === '/') {
        state.oauthUrl = url;
      } else {
        state.oauthUrl = url + '/';
      }
    },
  },
});

export default paramsSlice;
