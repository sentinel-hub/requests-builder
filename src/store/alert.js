import { createSlice } from '@reduxjs/toolkit';
import store from '.';

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //eslint-disable-next-line
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    type: null,
    text: '',
    id: null,
  },
  reducers: {
    addAlert: (state, action) => {
      const { type, text } = action.payload;
      const time = action.payload.time ?? 2500;
      state.text = text;
      state.type = type;
      let id = uuidv4();
      state.id = id;

      setTimeout(() => {
        store.dispatch(alertSlice.actions.removeAlert(id));
      }, time);
    },
    removeAlert: (state, action) => {
      if (action.payload === state.id) {
        state.type = null;
        state.text = '';
        state.id = '';
      }
    },
  },
});

export const addSuccessAlert = (text) => {
  store.dispatch(alertSlice.actions.addAlert({ type: 'SUCCESS', text }));
};

export const addWarningAlert = (text, time = undefined) => {
  store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text, time }));
};

export default alertSlice;
