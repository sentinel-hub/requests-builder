import store from './store';
import paramsSlice from './store/params';
import requestSlice from './store/request';
import { setBaseUrlAxiosInterpector } from './utils/configureAxios';

export const configureParams = (params) => {
  if (params['enable-statistics'] !== undefined) {
    store.dispatch(paramsSlice.actions.setEnableStatisticsApi(true));
    store.dispatch(requestSlice.actions.setMode('STATISTICAL'));
  }
  if (params['set-url']) {
    store.dispatch(paramsSlice.actions.setCustomUrl(params['set-url']));
    setBaseUrlAxiosInterpector(params['set-url']);
  }
};

export const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlParams.entries());
};
