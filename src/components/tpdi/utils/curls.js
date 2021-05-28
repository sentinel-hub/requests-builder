import {
  getSearchTpdiBody,
  tpdiCreateOrderBodyViaDataFilter,
  tpdiCreateOrderBodyViaProducts,
} from '../../../api/tpdi/common';

const BASE_TPDI_URL = 'https://services.sentinel-hub.com/api/v1/dataimport';

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
