import { generateBatchBodyRequest } from '../../../api/batch/utils';
import { BATCH_PATH } from '../../../api/batch/BatchResource';
import { getBaseUrl } from '../../../api/url';

const getBatchUrl = () => `${getBaseUrl()}/${BATCH_PATH}/process`;

export const createBatchRequestCurlCommand = (requestState, batchState, mapState, token) => {
  const body = JSON.stringify(generateBatchBodyRequest(requestState, batchState, mapState), null, 2);
  const curlCommand = `curl -X POST ${getBatchUrl()}/process \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const analyseBatchRequestCurlCommand = (token, batchId) => {
  const url = `${getBatchUrl()}/process${batchId ? batchId : '<batch request id>'}/analyse`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const startBatchRequestCurlCommand = (token, batchId) => {
  const url = `${getBatchUrl()}/process${batchId ? batchId : '<batch request id>'}/start`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const cancelBatchRequestCurlCommand = (token, batchId) => {
  const url = `${getBatchUrl()}/process${batchId ? batchId : '<batch request id>'}/cancel`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getAllBatchRequestsCurlCommand = (token) => {
  const curlCommand = `curl -X GET ${getBatchUrl()}/process \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getSingleBatchRequestCurlCommand = (token, batchId) => {
  const url = `${getBatchUrl()}/process${batchId ? batchId : '<batch request id>'}`;

  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getTileStatusBatchRequestCurlCommand = (token, batchId) => {
  const url = `${getBatchUrl()}/process${batchId ? batchId : '<batch request id>'}/tiles`;

  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};
