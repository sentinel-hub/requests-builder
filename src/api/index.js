import axios from 'axios';
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
    return (urlTemplate, endpointConfig = DEFAULT_ENDPOINT_CONFIG, contentType = 'application/json') => {
      return (data = undefined, fetchConfig = {}) => {
        const url = injectParameters(urlTemplate, data, hasBody);
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

        return this.makeRequest(method, url, headers, data, fetchConfig);
      };
    };
  }

  makeRequest(method, url, headers, data, extraConfig) {
    const config = {
      headers,
      ...extraConfig,
    };
    switch (method) {
      case 'GET':
        return axios.get(url, config);
      case 'POST':
        return axios.post(url, data, config);
      case 'PATCH':
        return axios.patch(url, data, config);
      case 'PUT':
        return axios.put(url, data, config);
      case 'DELETE':
        return axios.delete(url, config);
      default:
        throw Error('UNVALID API METHOD');
    }
  }
}

const instance = new Api();

export default instance;

export const getMessageFromApiError = (error, defaultErrorText = 'Something went wrong') =>
  error.body?.error?.message ?? defaultErrorText;
