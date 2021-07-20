import {
  getSearchTpdiBody,
  tpdiCreateOrderBodyViaDataFilter,
  tpdiCreateOrderBodyViaProducts,
} from '../../../api/tpdi/common';
import { TPDI_PATH } from '../../../api/tpdi/TpdiResource';
import { getBaseUrl } from '../../../api/url';

const getTpdiUrl = () => getBaseUrl() + TPDI_PATH;

// curl commands
export const getCreateViaProductsTpdiCurlCommand = (state) => {
  const body = JSON.stringify(tpdiCreateOrderBodyViaProducts(state), null, 2);
  const token = state.auth.user.access_token;
  const url = getTpdiUrl() + '/orders';
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const getCreateViaDataFilterTpdiCurlCommand = (state) => {
  const body = JSON.stringify(tpdiCreateOrderBodyViaDataFilter(state), null, 2);
  const token = state.auth.user.access_token;
  const url = getTpdiUrl() + '/orders';
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const getSearchTpdiCurlCommand = (state) => {
  const body = JSON.stringify(getSearchTpdiBody(state), null, 2);
  const token = state.auth.user.access_token;
  const url = getTpdiUrl() + '/search';
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const getAllOrdersTpdiCurlCommand = (state) => {
  const url = getTpdiUrl() + '/orders';
  const token = state.auth.user.access_token;
  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getConfirmOrderTpdiCurlCommand = (state) => {
  const url = getTpdiUrl() + '/orders/<your orderId>/confirm';
  const token = state.auth.user.access_token;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getDeleteOrderTpdiCurlCommand = (state) => {
  const url = getTpdiUrl() + '/orders/<your orderId>/';
  const token = state.auth.user.access_token;
  const curlCommand = `curl -X DELETE ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getQuotaCurlCommand = (token) => {
  const url = getTpdiUrl() + '/quotas';
  return `curl -X GET ${url} \n -H 'Authorization: Bearer ${token ? token : '<your-token-here>'}'\n`;
};
