import omit from 'lodash.omit';
import { getRequestObject, getProcessRequestConfig, getUrl } from '../../process/requests';
import axios from 'axios';
import { getRequestBody, getUrlFromCurl } from '../../process/requests/parseRequest';
import { isEmpty } from '../../../utils/const';

const BASE_BATCH_URL = 'https://services.sentinel-hub.com/api/v1/batch/process/';

export const createBatchRequest = (requestState, batchState, mapState, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const body = JSON.stringify(generateBatchBodyRequest(requestState, batchState, mapState));
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

const getAllBatchRequestsHelper = (token, next, reqConfig) => {
  const config = getConfigHelper(token, reqConfig);
  let url = next ? next : BASE_BATCH_URL;
  return axios.get(url, config);
};

export const getAllBatchRequests = async (token, reqConfig) => {
  let res = await getAllBatchRequestsHelper(token, undefined, reqConfig);
  let requests = res.data.data;
  while (res.data.links.next) {
    res = await getAllBatchRequestsHelper(token, res.data.links.next, reqConfig);
    requests = requests.concat(res.data.data);
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

export const deleteBatchRequest = (token, batchId, reqConfig) => {
  const url = BASE_BATCH_URL + batchId;
  const config = getConfigHelper(token, reqConfig);

  return axios.delete(url, config);
};

export const fetchTilesBatchRequest = async (id, token) => {
  const config = getConfigHelper(token);

  const fetchTilesHelper = async (next = undefined) => {
    const BASE_TILES_URL = `https://services.sentinel-hub.com/api/v1/batch/process/${id}/tiles`;
    const url = next ? next : BASE_TILES_URL;
    let res = await axios.get(url, config);
    return res.data;
  };
  let res = await fetchTilesHelper();
  let tiles = res.data;
  while (res.links.next) {
    res = await fetchTilesHelper(res.links.next);
    tiles = tiles.concat(res.data);
  }
  return new Promise((resolve, reject) => {
    resolve(tiles);
  });
};

export const createLowResPreviewRequest = (requestState, mapState, token, reqConfig) => {
  const request = getRequestObject(requestState, mapState);
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

const handleAdvancedCogParams = (batchState) => {
  const cogParams = {};
  if (batchState.overviewLevels) {
    try {
      const overviewLevels = batchState.overviewLevels
        .split(',')
        .map((n) => parseInt(n))
        .filter((n) => n);
      if (overviewLevels.length > 0) {
        cogParams.overviewLevels = overviewLevels;
      }
    } catch (err) {}
  }

  if (batchState.overviewMinSize) {
    const overviewMinSize = parseInt(batchState.overviewMinSize);
    if (overviewMinSize) {
      cogParams.overviewMinSize = overviewMinSize;
    }
  }

  if (batchState.blockxsize) {
    const blockxsize = parseInt(batchState.blockxsize);
    if (blockxsize) {
      cogParams.blockxsize = blockxsize;
    }
  }

  if (batchState.blockysize) {
    const blockysize = parseInt(batchState.blockysize);
    if (blockysize) {
      cogParams.blockysize = blockysize;
    }
  }

  return cogParams;
};

export const generateBatchBodyRequest = (requestState, batchState, mapState) => {
  const batchRequest = {};
  const processBody = getRequestObject(requestState, mapState);
  // omit width/height or resx/resy on batch create.
  processBody.output = { ...omit(processBody.output, ['resx', 'resy', 'width', 'height']) };
  batchRequest.processRequest = processBody;

  batchRequest.tilingGrid = {
    id: batchState.tillingGrid,
    resolution: batchState.resolution,
  };

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

  if (batchState.description) {
    batchRequest.description = batchState.description;
  }

  if (batchState.cogOutput && !batchState.createCollection) {
    const cogParams = handleAdvancedCogParams(batchState);
    if (!isEmpty(cogParams)) {
      batchRequest.output.cogParameters = handleAdvancedCogParams(batchState);
    }
  }

  if (batchState.createCollection) {
    if (!batchRequest.output) {
      batchRequest.output = {};
    }
    batchRequest.output.createCollection = true;
  } else if (batchState.collectionId) {
    if (!batchRequest.output) {
      batchRequest.output = {};
    }
    batchRequest.output.collectionId = batchState.collectionId;
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

export const createBatchRequestCurlCommand = (requestState, batchState, mapState, token) => {
  const body = JSON.stringify(generateBatchBodyRequest(requestState, batchState, mapState), null, 2);
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

export const sendEditedBatchRequest = (token, text, reqConfig) => {
  try {
    const url = getUrlFromCurl(text);
    const config = getConfigHelper(token, reqConfig);
    const parsed = JSON.parse(getRequestBody(text));
    return axios.post(url, parsed, config);
  } catch (error) {
    return Promise.reject('Cannot parse the request');
  }
};
