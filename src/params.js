import Axios from 'axios';
import jwt_dec from 'jwt-decode';
import store from './store';
import Api from './api';
import alertSlice, { addSuccessAlert, addWarningAlert } from './store/alert';
import authSlice from './store/auth';
import paramsSlice from './store/params';
import savedRequestsSlice from './store/savedRequests';

export const configureParams = async (params) => {
  if (params['set-url']) {
    store.dispatch(paramsSlice.actions.setUrl(params['set-url']));
  }
  if (params['set-auth-url']) {
    store.dispatch(paramsSlice.actions.setOAuthUrl(params['set-auth-url']));
  }
  if (params['collection-link']) {
    const link = params['collection-link'];
    try {
      const data = await Axios.get(link);
      if (Array.isArray(data.data)) {
        const requests = data.data
          .map((req) => ({
            creationTime: req.creationTime,
            request: req.request,
            name: req.name,
            mode: req.mode,
          }))
          .filter((a) => a);
        store.dispatch(savedRequestsSlice.actions.setCollection(requests));
        store.dispatch(
          alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Collection successfully loaded' }),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
  if (params['extended-settings'] !== undefined) {
    store.dispatch(paramsSlice.actions.setExtendedSettings());
  }
  if (params['impersonator_token'] !== undefined) {
    try {
      const token = params['impersonator_token'];
      const decoded = jwt_dec(token);
      store.dispatch(
        authSlice.actions.setUser({
          userdata: decoded,
          access_token: token,
        }),
      );
      Api.setAuthHeader(token);
      store.dispatch(authSlice.actions.setIsImpersonating());
      addSuccessAlert('Impersonating...');
    } catch (err) {
      addWarningAlert('Impersonator token not valid');
    }
  }
};

export const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlParams.entries());
};

// const removeParams = (loParams) => {
//   const urlParams = new URLSearchParams(window.location.search);
//   loParams.forEach((param) => {
//     urlParams.delete(param);
//   });
//   window.history.replaceState({}, 'Requests Builder', `?${urlParams.toString()}`);
// };
