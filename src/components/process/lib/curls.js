import omit from 'lodash.omit';
import {
  getJSONRequestBody,
  getRequestObject,
  getEvalscriptDebuggerHelper,
} from '../../../api/process/utils';
import { getProcessUrl } from '../../../api/url';

const getToken = (token) => {
  if (token) {
    return token;
  } else {
    return '<YOU NEED TO LOGIN TO GET A TOKEN>';
  }
};

const generateHeadersForCurl = (reqState, token) => {
  let headers = `-H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${getToken(token)}'`;
  if (reqState.responses.length > 1) {
    headers = headers + "\n -H 'Accept: application/tar'";
  }
  return headers;
};

const generateHeadersForMultipartCurl = (reqState, token) => {
  let headers = ` -H 'Content-Type: multipart/form-data' \\\n -H 'Authorization: Bearer ${getToken(token)}'`;
  if (reqState.responses.length > 1) {
    headers = headers + " \\\n -H 'Accept: application/tar'";
  }
  return headers;
};

export const generateProcessCurlCommand = (reqState, mapState, token) => {
  const body = getJSONRequestBody(reqState, mapState);
  const curlCommand = `curl -X POST ${getProcessUrl(reqState)} \n ${generateHeadersForCurl(
    reqState,
    token,
  )} \n -d '${body}'`;
  return curlCommand;
};

export const generateProcessMultipartCurl = (reqState, mapState, token) => {
  const request = JSON.stringify(omit(getRequestObject(reqState, mapState), ['evalscript']), null, 2);
  const evalscript = getEvalscriptDebuggerHelper(reqState.evalscript);
  const curlCommand = `curl -X POST ${getProcessUrl(reqState)} \\\n${generateHeadersForMultipartCurl(
    reqState,
    token,
    true,
  )} \\\n--form-string 'request=${request}' \\\n--form-string 'evalscript=${evalscript}'`;
  return curlCommand;
};
