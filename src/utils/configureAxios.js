import Axios from 'axios';
import store, { alertSlice } from '../store';
import { doLogout, doLogin } from '../components/AuthHeader';
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
      store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Expired token. Log in again!' }));
      doLogout();
      return doLogin().then((token) => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return Axios(originalRequest);
      });
    }

    return Promise.reject(error);
  },
);

export default configureAxios;
