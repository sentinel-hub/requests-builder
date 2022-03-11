import { createSlice } from '@reduxjs/toolkit';
import store from '.';

const INITIAL_STATE = {
  isOpen: false,
  onConfirm: null,
  content: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState: INITIAL_STATE,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.onConfirm = action.payload.onConfirm;
      state.content = action.payload.content;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.onConfirm = null;
      state.content = null;
    },
  },
});

export const closeConfirmationModal = () => {
  store.dispatch(modalSlice.actions.closeModal());
};

export const addModal = ({ onConfirm, content }) => {
  store.dispatch(modalSlice.actions.openModal({ onConfirm, content }));
};

export default modalSlice;
