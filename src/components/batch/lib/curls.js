import { generateBatchBodyRequest } from '../../../api/batch/utils';
import { getBatchUrl } from '../../../api/url';

const batchUrl = (requestState) => `${getBatchUrl(requestState)}/process/`;

export const createBatchRequestCurlCommand = (requestState, batchState, mapState, token) => {
  const body = JSON.stringify(generateBatchBodyRequest(requestState, batchState, mapState), null, 2);
  const curlCommand = `curl -X POST ${batchUrl(
    requestState,
  )} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const analyseBatchRequestCurlCommand = (requestState, token, batchId) => {
  const url = `${batchUrl(requestState)}${batchId ? batchId : '<batch request id>'}/analyse`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const startBatchRequestCurlCommand = (requestState, token, batchId) => {
  const url = `${batchUrl(requestState)}${batchId ? batchId : '<batch request id>'}/start`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const cancelBatchRequestCurlCommand = (requestState, token, batchId) => {
  const url = `${batchUrl(requestState)}${batchId ? batchId : '<batch request id>'}/cancel`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getAllBatchRequestsCurlCommand = (requestState, token) => {
  const curlCommand = `curl -X GET ${batchUrl(
    requestState,
  )} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getSingleBatchRequestCurlCommand = (requestState, token, batchId) => {
  const url = `${batchUrl(requestState)}${batchId ? batchId : '<batch request id>'}`;

  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getTileStatusBatchRequestCurlCommand = (requestState, token, batchId) => {
  const url = `${batchUrl(requestState)}${batchId ? batchId : '<batch request id>'}/tiles`;

  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};
