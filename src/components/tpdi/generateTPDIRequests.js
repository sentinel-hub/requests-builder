import axios from 'axios';
import moment from 'moment';
import { generateBounds } from '../process/requests';
import { dataFilterDefaultValues } from './const';
import { isAirbus, stateConstellationToConstellation } from './utils';

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

const getAirbusDataFilterOptions = (dataFilterOptions) => {
  let options = {};
  for (let key in dataFilterOptions) {
    // check if the property is not default or have the default value
    if (dataFilterOptions[key] !== 'DEFAULT' && dataFilterDefaultValues[key] !== dataFilterOptions[key]) {
      options[key] = dataFilterOptions[key];
    }
  }
  return options;
};

const getTimeRange = (requestState, isSingleDate) => {
  if (isSingleDate) {
    return {
      timeRange: {
        from: requestState.timeFrom[0],
        to: moment.utc(requestState.timeFrom[0]).endOf('day').format(),
      },
    };
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
    provider: 'AIRBUS',
    bounds: {
      ...generateBounds(state.map),
    },
    data: [
      {
        constellation: stateConstellationToConstellation[state.tpdi.provider],
        dataFilter: {
          ...getAirbusDataFilterOptions(state.airbus.dataFilterOptions),
          ...getTimeRange(state.request, state.tpdi.isSingleDate),
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
      ...generateBounds(state.map),
    },
    data: [
      {
        itemType: 'PSScene4Band',
        productBundle: 'analytic',
        dataFilter: {
          ...getTimeRange(state.request, state.tpdi.isSingleDate),
          maxCloudCoverage: state.planet.maxCloudCoverage,
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
  requestBody.input.data[0].productBundle = 'analytic';
  requestBody.input.data[0].itemIds = state.tpdi.products.map((product) => product.id);
  requestBody.input.data[0].harmonizeTo = state.planet.harmonizeTo;
  return requestBody;
};

//SEARCH
const getSearchTpdiBody = (state) => {
  let requestBody;
  if (isAirbus(state.tpdi.provider)) {
    requestBody = getAirbusSearchRequestBody(state);
  } else if (state.tpdi.provider === 'PLANET') {
    requestBody = getPlanetSearchRequestBody(state);
  }
  return requestBody;
};

const getTPDISearchHelper = (requestBody, config, next = undefined) => {
  const url = next ?? BASE_TPDI_URL + '/search';
  return axios.post(url, requestBody, config);
};

export const getTPDISearchRequest = async (state, token, reqConfig, next = undefined) => {
  const requestBody = getSearchTpdiBody(state);
  const config = getReqConfig(token, reqConfig);

  let res = await getTPDISearchHelper(requestBody, config);
  const results = res.data.features;
  while (res.data.links.next) {
    res = await getTPDISearchHelper(requestBody, config, res.data.links.next);
    results.push(...res.data.features);
  }
  return Promise.resolve({ data: { features: results } });
};

//ORDER
export const tpdiCreateOrderBodyViaProducts = (state) => {
  let requestBody;
  if (isAirbus(state.tpdi.provider)) {
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
  if (isAirbus(state.tpdi.provider)) {
    requestBody.input = getAirbusSearchRequestBody(state);
  } else if (state.tpdi.provider === 'PLANET') {
    requestBody.input = getPlanetSearchRequestBody(state);
    requestBody.input.data[0].harmonizeTo = state.planet.harmonizeTo;
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

// Thumbnails
export const getProductThumbnail = (productId, collectionId, token, reqConfig) => {
  const url = `${BASE_TPDI_URL}/collections/${collectionId}/products/${productId}/thumbnail`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
    ...reqConfig,
  };
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

export const getQuotaCurlCommand = (token) => {
  const url = BASE_TPDI_URL + '/quotas';
  return `curl -X GET ${url} \n -H 'Authorization: Bearer ${token ? token : '<your-token-here>'}'\n`;
};
