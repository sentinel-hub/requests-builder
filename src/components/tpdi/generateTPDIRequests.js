import axios from 'axios';
import { generateBounds } from '../../utils/generateRequest';

const BASE_TPDI_URL = 'https://services.sentinel-hub.com/api/v1/dataimport';

//helpers
const getReqConfig = (token, reqConfig) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
  return config;
};

const getAirbusDataFilterOptions = (dataFitlerOptions) => {
  let options = {};
  for (let key in dataFitlerOptions) {
    if (dataFitlerOptions[key] !== 'DEFAULT') {
      options[key] = dataFitlerOptions[key];
    }
  }
  return options;
};

const getTimeRange = (requestState) => {
  if (requestState.isTimeRangeDisabled) {
    return {};
  }
  return {
    timeRange: {
      from: requestState.timeFrom[0],
      to: requestState.timeTo[0],
    },
  };
};

const getAirbusSearchRequestBody = (state) => {
  const request = {
    provider: state.tpdi.provider,
    bounds: {
      ...generateBounds(state.request),
    },
    data: [
      {
        constellation: state.airbus.constellation,
        dataFilter: {
          ...getAirbusDataFilterOptions(state.airbus.dataFilterOptions),
          ...getTimeRange(state.request),
        },
      },
    ],
  };

  return request;
};

const getPlanetSearchRequestBody = (state) => {
  const request = {
    provider: state.tpdi.provider,
    planetApiKey: state.planet.planetApiKey,
    bounds: {
      ...generateBounds(state.request),
    },
    data: [
      {
        itemType: 'PSScene4Band',
        dataFilter: {
          ...getTimeRange(state.request),
        },
      },
    ],
  };
  return request;
};

const getAirbusOrderBody = (state) => {
  const requestBody = {};
  requestBody.input = getAirbusSearchRequestBody(state);
  requestBody.name = state.tpdi.name;
  requestBody.collectionId = state.tpdi.collectionId;
  delete requestBody.input.data[0].dataFilter;
  requestBody.input.data[0].products = state.tpdi.products.map((product) => ({
    id: product.id,
  }));

  return requestBody;
};

const getPlanetOrderBody = (state) => {
  const requestBody = {};
  requestBody.input = getPlanetSearchRequestBody(state);
  requestBody.name = state.tpdi.name;
  requestBody.collectionId = state.tpdi.collectionId;
  delete requestBody.input.data[0].dataFilter;
  requestBody.input.data[0].productBundle = 'analytic'; //listofstrings
  requestBody.input.data[0].itemIds = state.tpdi.products.map((product) => product.id);

  return requestBody;
};

//SEARCH
const getSearchTpdiBody = (state) => {
  let requestBody;
  if (state.tpdi.provider === 'AIRBUS') {
    requestBody = getAirbusSearchRequestBody(state);
  } else if (state.tpdi.provider === 'PLANET') {
    requestBody = getPlanetSearchRequestBody(state);
  }
  return requestBody;
};

export const getTPDISearchRequest = (state, token, reqConfig) => {
  const requestBody = getSearchTpdiBody(state);
  const url = BASE_TPDI_URL + '/search';
  const config = getReqConfig(token, reqConfig);
  return axios.post(url, JSON.stringify(requestBody), config);
};

//ORDER
export const tpdiCreateOrderBodyViaProducts = (state) => {
  let requestBody;
  if (state.tpdi.provider === 'AIRBUS') {
    requestBody = getAirbusOrderBody(state);
  } else if (state.tpdi.provider === 'PLANET') {
    requestBody = getPlanetOrderBody(state);
  }
  return requestBody;
};

export const createTPDIOrder = (state, token, reqConfig) => {
  const requestBody = tpdiCreateOrderBodyViaProducts(state);
  const url = BASE_TPDI_URL + '/orders';
  const config = getReqConfig(token, reqConfig);
  return axios.post(url, JSON.stringify(requestBody), config);
};

export const tpdiCreateOrderBodyViaDataFilter = (state) => {
  let requestBody = {};
  if (state.tpdi.provider === 'AIRBUS') {
    requestBody.input = getAirbusSearchRequestBody(state);
  } else if (state.tpdi.provider === 'PLANET') {
    requestBody.input = getPlanetSearchRequestBody(state);
  }
  requestBody.name = state.tpdi.name;
  requestBody.collectionId = state.tpdi.collectionId;

  return requestBody;
};

export const createTPDIDataFilterOrder = (state, token, reqConfig) => {
  const requestBody = tpdiCreateOrderBodyViaDataFilter(state);
  const url = BASE_TPDI_URL + '/orders';
  const config = getReqConfig(token, reqConfig);
  return axios.post(url, JSON.stringify(requestBody), config);
};

export const deleteTPDIOrder = (token, orderId) => {
  const url = BASE_TPDI_URL + '/orders/' + orderId;
  const config = getReqConfig(token);
  return axios.delete(url, config);
};

export const confirmTPDIOrder = (token, orderId, reqConfig) => {
  const url = BASE_TPDI_URL + '/orders/' + orderId + '/confirm';
  const config = getReqConfig(token, reqConfig);
  return axios.post(url, null, config);
};

export const getAllTPDIOrders = (token, reqConfig) => {
  const url = BASE_TPDI_URL + '/orders';
  const config = getReqConfig(token, reqConfig);
  return axios.get(url, config);
};

export const getSingleTpdiOrder = (state, orderId) => {
  const url = BASE_TPDI_URL + '/orders/' + orderId;
  const config = getReqConfig(state);
  return axios.get(url, config);
};

// Get quota
export const getTPDIQuota = (token, reqConfig) => {
  const url = BASE_TPDI_URL + '/quotas';
  const config = getReqConfig(token, reqConfig);
  return axios.get(url, config);
};

//Deliveries
export const getAllDeliveries = (token, orderId, reqConfig) => {
  const url = BASE_TPDI_URL + '/orders/' + orderId + '/deliveries';
  const config = getReqConfig(token, reqConfig);
  return axios.get(url, config);
};

// curl commands
export const getCreateViaProductsTpdiCurlCommand = (state) => {
  const body = JSON.stringify(tpdiCreateOrderBodyViaProducts(state), null, 2);
  const token = state.auth.user.access_token;
  const url = BASE_TPDI_URL + '/orders';
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const getCreateViaDataFilterTpdiCurlCommand = (state) => {
  const body = JSON.stringify(tpdiCreateOrderBodyViaDataFilter(state), null, 2);
  const token = state.auth.user.access_token;
  const url = BASE_TPDI_URL + '/orders';
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const getSearchTpdiCurlCommand = (state) => {
  const body = JSON.stringify(getSearchTpdiBody(state), null, 2);
  const token = state.auth.user.access_token;
  const url = BASE_TPDI_URL + '/search';
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const getAllOrdersTpdiCurlCommand = (state) => {
  const url = BASE_TPDI_URL + '/orders';
  const token = state.auth.user.access_token;
  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getConfirmOrderTpdiCurlCommand = (state) => {
  const url = BASE_TPDI_URL + '/orders/<your orderId>/confirm';
  const token = state.auth.user.access_token;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getDeleteOrderTpdiCurlCommand = (state) => {
  const url = BASE_TPDI_URL + '/orders/<your orderId>/';
  const token = state.auth.user.access_token;
  const curlCommand = `curl -X DELETE ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};
