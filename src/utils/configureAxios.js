import Axios from 'axios';
import store from '../store';
import alertSlice from '../store/alert';
import authSlice from '../store/auth';
import { getAssistedTokenDocument } from './authHelpers';

const tokenState = {
  access_token: '',
  expires_in: null,
  isFetchingAssisted: false,
};

export const setTokenState = (access_token, expires_in) => {
  tokenState.access_token = access_token;
  tokenState.expires_in = expires_in;
  tokenState.isFetchingAssisted = false;
};

const parseAssistedDocument = (stringDoc) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(stringDoc, 'text/html');
  const str = doc.scripts[0].innerText;
  const ini = str.indexOf('{');
  const end = str.indexOf('}');
  return JSON.parse(str.substr(ini, end - ini + 1));
};

const configureAxios = () => {
  delete Axios.defaults.headers.common['Accept'];
};

const checkIfPlanetApiFail = (error) => {
  try {
    return error.response.data.error.message.includes('api-key');
  } catch (err) {
    return false;
  }
};

const checkStatusCode401 = (error) => {
  try {
    return error.response.status === 401;
  } catch (err) {
    return false;
  }
};

Axios.interceptors.request.use(
  async (config) => {
    if (
      tokenState.expires_in &&
      tokenState.access_token &&
      tokenState.expires_in < Date.now() &&
      tokenState.isFetchingAssisted === false
    ) {
      tokenState.isFetchingAssisted = true;
      const res = await getAssistedTokenDocument();
      const parsed = parseAssistedDocument(res.data);
      const expires_in = Date.now() + parsed.expires_in * 1000;
      setTokenState(parsed.access_token, expires_in);
      store.dispatch(
        authSlice.actions.setToken({ access_token: parsed.access_token, expires_in: expires_in }),
      );
      config.headers.Authorization = 'Bearer ' + parsed.access_token;
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const edcResponseInterceptor = () => {
  Axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      let originalRequest = error.config;
      if (checkStatusCode401(error) && !originalRequest._retry && !checkIfPlanetApiFail(error)) {
        originalRequest._retry = true;
        store.dispatch(
          alertSlice.actions.addAlert({ type: 'WARNING', text: 'Expired token. Log in again!' }),
        );
        return Axios.post('/token_sentinel_hub').then((res) => {
          store.dispatch(
            authSlice.actions.setUser({ userdata: 'EDC User', access_token: res.data.access_token }),
          );
          originalRequest.headers.Authorization = 'Bearer ' + res.data.access_token;
          return Axios(originalRequest);
        });
      }
    },
  );
};

export default configureAxios;
