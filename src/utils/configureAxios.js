import Axios from 'axios';
import store, { alertSlice, authSlice } from '../store';
import { doLogout, doLogin } from '../components/common/AuthHeader';

const lastUsedToken = {
  token: '',
  time: 0,
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

const getTokenFromHeaders = (config) => {
  if (config.headers.Authorization) {
    return config.headers.Authorization.split('Bearer ')[1];
  }
};

Axios.interceptors.request.use(
  (config) => {
    if (
      lastUsedToken.time &&
      getTokenFromHeaders(config) !== lastUsedToken.token &&
      (lastUsedToken.time - Date.now()) / 1000 < 3600
    ) {
      config.headers.Authorization = 'Bearer ' + lastUsedToken.token;
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

export const shResponseInterceptor = () => {
  // Interceptor to prompt login in case token is expired.
  Axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // If 401 prompt login
      let originalRequest = error.config;
      if (checkStatusCode401(error) && !originalRequest._retry && !checkIfPlanetApiFail(error)) {
        originalRequest._retry = true;
        store.dispatch(
          alertSlice.actions.addAlert({ type: 'WARNING', text: 'Expired token. Log in again!' }),
        );
        doLogout();
        return doLogin().then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          lastUsedToken.token = token;
          lastUsedToken.time = Date.now();
          return Axios(originalRequest);
        });
      }

      return Promise.reject(error);
    },
  );
};

export default configureAxios;
