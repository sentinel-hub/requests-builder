import Axios from 'axios';
import store from './store';
import alertSlice from './store/alert';
import paramsSlice from './store/params';
import savedRequestsSlice from './store/savedRequests';
import { setBaseUrlAxiosInterpector } from './utils/configureAxios';

export const configureParams = async (params) => {
  if (params['set-url']) {
    store.dispatch(paramsSlice.actions.setCustomUrl(params['set-url']));
    setBaseUrlAxiosInterpector(params['set-url']);
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
          }))
          .filter((a) => a);
        store.dispatch(savedRequestsSlice.actions.setCollection(requests));
        store.dispatch(
          alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Collection successfully loaded' }),
        );
        removeParams(['collection-link']);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlParams.entries());
};

const removeParams = (loParams) => {
  const urlParams = new URLSearchParams(window.location.search);
  loParams.forEach((param) => {
    urlParams.delete(param);
  });
  window.history.replaceState({}, 'Requests Builder', `?${urlParams.toString()}`);
};
