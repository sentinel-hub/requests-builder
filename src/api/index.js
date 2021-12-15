import axios from 'axios';
import store from '../store';
import { isEmpty } from '../utils/commonUtils';

const DEFAULT_ENDPOINT_CONFIG = {
  authenticated: true,
  endpointHeaders: {},
};

const injectParameters = (urlTemplate, data, hasBody) => {
  if (!urlTemplate.includes(':')) {
    return urlTemplate;
  }
  data = { ...data };

  const params = urlTemplate.match(/:\w+/gm) ?? [];

  for (let param of params) {
    const urlTag = param.slice(1);
    if (!isNaN(parseInt(urlTag, 10))) {
      delete data[urlTag];
      continue;
    }
    let value = data[urlTag];
    if (value === undefined) {
      value = urlTag;
    }
    urlTemplate = urlTemplate.replace(param, encodeURIComponent(value));
    delete data[urlTag];
  }

  if (!hasBody && !isEmpty(data)) {
    const searchParams = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    urlTemplate = `${urlTemplate}/?${searchParams.toString()}`;
  }
  return urlTemplate;
};

const defaultHeaders = {};
const authHeaders = {};

class Api {
  GET = this.makeMethod('GET');
  POST = this.makeMethod('POST', true);
  PUT = this.makeMethod('PUT', true);
  PATCH = this.makeMethod('PATCH', true);
  DELETE = this.makeMethod('DELETE');

  setAuthHeader = (token) => {
    authHeaders['Authorization'] = `Bearer ${token}`;
  };

  makeMethod(method, hasBody = false) {
    return (path, endpointConfig = DEFAULT_ENDPOINT_CONFIG, contentType = 'application/json', isFullUrl) => {
      return (data = undefined, fetchConfig = {}) => {
        const pathWithParams = injectParameters(path, data, hasBody);
        const { authenticated, endpointHeaders } = endpointConfig;
        let headers = {
          Accept: contentType,
          ...defaultHeaders,
          ...endpointHeaders,
        };

        if (hasBody) {
          headers['Content-Type'] = 'application/json';
        }

        if (authenticated && !headers.Authorization) {
          headers = { ...headers, ...authHeaders };
        }

        return this.makeRequest(method, pathWithParams, headers, data, fetchConfig, isFullUrl);
      };
    };
  }

  makeRequest(method, pathOrUrl, headers, data, extraConfig, isFullUrl) {
    const config = {
      headers,
      ...extraConfig,
    };
    const reqUrl = isFullUrl ? pathOrUrl : store.getState().params.url + pathOrUrl;
    switch (method) {
      case 'GET':
        return axios.get(reqUrl, config);
      case 'POST':
        return axios.post(reqUrl, data, config);
      case 'PATCH':
        return axios.patch(reqUrl, data, config);
      case 'PUT':
        return axios.put(reqUrl, data, config);
      case 'DELETE':
        return axios.delete(reqUrl, config);
      default:
        throw Error('UNVALID API METHOD');
    }
  }
}

const instance = new Api();

export default instance;

export const getMessageFromApiError = (error, defaultErrorText = 'Something went wrong') => {
  const message = error.response?.data?.error?.message ?? defaultErrorText;
  let errors = error.response?.data?.error?.errors;
  if (!errors) {
    return message;
  }

  if (!errors.length) {
    errors = [errors];
  }
  const len = errors.length;
  const errMessages = errors
    .filter((err) => err.parameter !== undefined && err.violation !== undefined)
    .map(
      (error, idx) =>
        `parameter: ${error.parameter} has an invalid value. ${error.violation}${idx < len - 1 ? '\n' : ''}`,
    );
  return `${message}\n${errMessages}`;
};
