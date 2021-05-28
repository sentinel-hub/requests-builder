import { generateBatchBodyRequest } from '../../../api/batch/utils';
import { BATCH_BASE_URL } from '../../../api/batch/BatchResource';

const BASE_BATCH_PROCESS = `${BATCH_BASE_URL}/process`;

export const createBatchRequestCurlCommand = (requestState, batchState, mapState, token) => {
  const body = JSON.stringify(generateBatchBodyRequest(requestState, batchState, mapState), null, 2);
  const curlCommand = `curl -X POST ${BASE_BATCH_PROCESS} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const analyseBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_PROCESS}${batchId ? batchId : '<batch request id>'}/analyse`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const startBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_PROCESS}${batchId ? batchId : '<batch request id>'}/start`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const cancelBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_PROCESS}${batchId ? batchId : '<batch request id>'}/cancel`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getAllBatchRequestsCurlCommand = (token) => {
  const curlCommand = `curl -X GET ${BASE_BATCH_PROCESS} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getSingleBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_PROCESS}${batchId ? batchId : '<batch request id>'}`;

  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getTileStatusBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_PROCESS}${batchId ? batchId : '<batch request id>'}/tiles`;

  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};
