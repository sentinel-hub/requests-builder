import { getRequestObject, getProcessRequestConfig, getUrl } from './generateRequest';
import axios from 'axios';

const BASE_BATCH_URL = 'https://services.sentinel-hub.com/api/v1/batch/process/';

export const createBatchRequest = (requestState, batchState, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const body = JSON.stringify(generateBatchBodyRequest(requestState, batchState));
  return axios.post(BASE_BATCH_URL, body, config);
};

export const analyseBatchRequest = (token, batchId) => {
  const url = BASE_BATCH_URL + batchId + '/analyse';
  const config = getConfigHelper(token);

  return axios.post(url, null, config);
};

export const cancelBatchRequest = (token, batchId) => {
  const url = BASE_BATCH_URL + batchId + '/cancel';
  const config = getConfigHelper(token);

  return axios.post(url, null, config);
};

export const startBatchRequest = (token, batchId) => {
  const config = getConfigHelper(token);
  const url = BASE_BATCH_URL + batchId + '/start';

  return axios.post(url, null, config);
};

const getAllBatchRequestsHelper = (token, viewtoken, reqConfig) => {
  const config = getConfigHelper(token, reqConfig);
  let url = BASE_BATCH_URL;
  if (viewtoken) {
    url = url + '?viewtoken=' + viewtoken;
  }
  return axios.get(url, config);
};

export const getAllBatchRequests = async (token, reqConfig) => {
  let res = await getAllBatchRequestsHelper(token, undefined, reqConfig);
  let requests = res.data.member;
  while (res.data.view.nextToken) {
    res = await getAllBatchRequestsHelper(token, res.data.view.nextToken, reqConfig);
    requests = requests.concat(res.data.member);
  }
  return new Promise((resolve, reject) => {
    resolve({ data: { member: requests } });
  });
};

export const getSingleBatchRequest = (token, batchId) => {
  const url = BASE_BATCH_URL + batchId;
  const config = getConfigHelper(token);

  return axios.get(url, config);
};

export const fetchTilesBatchRequest = async (id, token) => {
  const config = getConfigHelper(token);

  const fetchTilesHelper = async (viewtoken = 0) => {
    const url = `https://services.sentinel-hub.com/api/v1/batch/process/${id}/tiles?viewtoken=${viewtoken}`;
    let res = await axios.get(url, config);
    return res.data;
  };
  let res = await fetchTilesHelper();
  let tiles = res.member;
  while (res.view.nextToken) {
    res = await fetchTilesHelper(res.view.nextToken);
    tiles = tiles.concat(res.member);
  }
  return new Promise((resolve, reject) => {
    resolve(tiles);
  });
};

export const createLowResPreviewRequest = (requestState, token, reqConfig) => {
  const request = getRequestObject(requestState);

  // Set width/height to do a process request.
  request.output.width = requestState.width;
  request.output.height = requestState.height;

  const body = JSON.stringify(request, null, 2);
  const config = getProcessRequestConfig(token, reqConfig, requestState);
  return axios.post(getUrl(requestState), body, config);
};

const getConfigHelper = (token, reqConfig) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
  return config;
};

export const generateBatchBodyRequest = (requestState, batchState) => {
  const batchRequest = {};
  const processBody = getRequestObject(requestState);
  batchRequest.processRequest = processBody;
  batchRequest.tillingGridId = batchState.tillingGrid;
  if (batchState.specifyingBucketName) {
    batchRequest.bucketName = batchState.bucketName;
  } else {
    batchRequest.output = {
      defaultTilePath: `s3://${batchState.bucketName}/${batchState.defaultTilePath}`,
    };
  }
  if (batchState.cogOutput) {
    batchRequest.output = {
      ...batchRequest.output,
      cogOutput: true,
    };
  }
  batchRequest.resolution = batchState.resolution;
  if (batchState.description) {
    batchRequest.description = batchState.description;
  }

  return batchRequest;
};

export const retryFailedTile = (requestId, tileId, token) => {
  const url = `${BASE_BATCH_URL}${requestId}/tiles/${tileId}/restart`;
  const config = getConfigHelper(token);
  return axios.post(url, null, config);
};

export const restartPartialRequest = (requestId, token, reqConfig) => {
  const url = `${BASE_BATCH_URL}${requestId}/restartpartial`;
  const config = getConfigHelper(token, reqConfig);
  return axios.post(url, null, config);
};

//Curl commands

export const createBatchRequestCurlCommand = (requestState, batchState, token) => {
  const body = JSON.stringify(generateBatchBodyRequest(requestState, batchState), null, 2);
  const curlCommand = `curl -X POST ${BASE_BATCH_URL} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;

  return curlCommand;
};

export const analyseBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_URL}${batchId ? batchId : '<batch request id>'}/analyse`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const startBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_URL}${batchId ? batchId : '<batch request id>'}/start`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const cancelBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_URL}${batchId ? batchId : '<batch request id>'}/cancel`;
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getAllBatchRequestsCurlCommand = (token) => {
  const curlCommand = `curl -X GET ${BASE_BATCH_URL} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getSingleBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_URL}${batchId ? batchId : '<batch request id>'}`;

  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};

export const getTileStatusBatchRequestCurlCommand = (token, batchId) => {
  const url = `${BASE_BATCH_URL}${batchId ? batchId : '<batch request id>'}/tiles`;

  const curlCommand = `curl -X GET ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n`;

  return curlCommand;
};
