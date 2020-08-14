import Axios from 'axios';
import { CRS, DATASOURCES, LOCATIONS, isEmpty } from '../utils/const';
import { transformGeometryToNewCrs } from './crsTransform';

const byocLocationToBaseUrl = (location) => {
  if (location === 'EU-CENTRAL-1') {
    return 'https://services.sentinel-hub.com/';
  } else if (location === 'US-WEST-2') {
    return 'https://services-uswest2.sentinel-hub.com/';
  }
};

export const getUrl = (requestState) => {
  if (requestState.datasource === 'CUSTOM') {
    return byocLocationToBaseUrl(requestState.byocLocation) + 'api/v1/process';
  } else {
    return DATASOURCES[requestState.datasource].url;
  }
};

export const getJSONRequestBody = (reqState, formated = true) => {
  const requestBody = getRequestObject(reqState);
  if (formated) {
    return JSON.stringify(requestBody, null, 2);
  }
  return JSON.stringify(requestBody);
};

export const getRequestObject = (reqState) => {
  const requestBody = {
    input: {
      bounds: {
        ...generateBounds(reqState),
      },
      data: getRequestData(reqState),
    },
    output: {
      ...generateOutput(reqState),
      responses: generateResponses(reqState),
    },
    evalscript: getEvalscriptDebuggerHelper(reqState.evalscript),
  };
  return requestBody;
};

const getConsoleLogContents = (evalscript) => {
  let startIdx = evalscript.indexOf('console.log(') + 11;
  let idx = startIdx;
  while (evalscript[idx] !== ';' && idx < evalscript.length) {
    idx++;
  }
  let endIdx = idx;
  let contents = evalscript.substring(startIdx, endIdx);
  return { contents: contents, newEvalscript: evalscript.replace(contents, '') };
};

const processConsoleLogContents = (contents) => {
  //customSplit splits each comma that is not inside an array [].
  const customSplit = (str, separator) => {
    let list = [''];
    let i = 0;
    let skip = false;
    for (let char of str) {
      if (char === '[') {
        skip = true;
      }
      if (char === ']') {
        skip = false;
      }
      if (char === separator && !skip) {
        i++;
        list.push('');
      } else {
        list[i] += char;
      }
    }
    return list;
  };
  return customSplit(contents, ',').join('+ "," + ');
};

//looks for console.log and changes it with throw new Error() for debug purposes.
const getEvalscriptDebuggerHelper = (evalscript) => {
  if (!evalscript.includes('console.log(')) {
    return evalscript;
  } else {
    const { contents, newEvalscript } = getConsoleLogContents(evalscript);
    const consoleLogContents = processConsoleLogContents(contents);
    let returnVal = newEvalscript.replace('console.log', 'throw new Error' + consoleLogContents);
    return returnVal;
  }
};

export const getLocationByDatasource = (datasource) => LOCATIONS[DATASOURCES[datasource].url];

const getRequestData = (reqState) => {
  if (reqState.datasource === 'DATAFUSION') {
    return reqState.datafusionSources.map((source, idx) => ({
      type: source.datasource,
      id: source.id,
      location: getLocationByDatasource(source.datasource),
      ...getDataFilter(reqState, idx),
      ...getProcessingOptions(reqState, idx),
    }));
  } else {
    return [
      {
        type: reqState.datasource,
        ...getDataFilter(reqState),
        ...getProcessingOptions(reqState),
      },
    ];
  }
};

const getDataFilter = (requestState, idx) => {
  const dataFilter = {
    dataFilter: {
      ...getTimeRange(requestState, idx),
      ...getDataFilterOptions(requestState, idx),
    },
  };
  if (isEmpty(dataFilter.dataFilter)) {
    return {};
  }
  return dataFilter;
};

const getTimeRange = (requestState, idx = 0) => {
  if (requestState.isTimeRangeDisabled) {
    return {};
  }
  return {
    timeRange: {
      from: requestState.timeFrom[idx] ? requestState.timeFrom[idx] : requestState.timeFrom[0],
      to: requestState.timeTo[idx] ? requestState.timeTo[idx] : requestState.timeTo[0],
    },
  };
};

export const generateBounds = (requestState) => {
  if (requestState.geometryType === 'BBOX') {
    return {
      bbox: transformGeometryToNewCrs(requestState.geometry, requestState.CRS),
      properties: {
        crs: CRS[requestState.CRS].url,
      },
    };
  } else if (requestState.geometryType === 'POLYGON') {
    return {
      geometry: transformGeometryToNewCrs(requestState.geometry, requestState.CRS),
      properties: {
        crs: CRS[requestState.CRS].url,
      },
    };
  }
};

const generateOutput = (state) => {
  //HEIGHT or RES
  if (state.mode === 'PROCESS') {
    if (state.heightOrRes === 'HEIGHT') {
      return {
        width: state.width,
        height: state.height,
      };
    } else if (state.heightOrRes === 'RES') {
      return {
        resx: state.width,
        resy: state.height,
      };
    }
  } else if (state.mode === 'BATCH') {
    return {};
  }
};

const generateResponses = (reqState) =>
  reqState.responses.map((resp) => ({ identifier: resp.identifier, format: { type: resp.format } }));

const getProcessingOptions = (reqState, idx = 0) => {
  const resObject = {
    processing: {},
  };
  //Iterate through the keys, omit DEFAULT ones.
  if (reqState.processingOptions[idx].options) {
    Object.keys(reqState.processingOptions[idx].options).forEach((key) => {
      const value = reqState.processingOptions[idx].options[key];
      if (value !== 'DEFAULT' && value !== undefined) {
        resObject.processing[key] = value;
      }
    });
  }
  return Object.entries(resObject.processing).length !== 0 ? resObject : {};
};
const getDataFilterOptions = (reqState, idx = 0) => {
  const resObject = {};
  //Iterate through the keys, omit DEFAULT ones.
  if (reqState.dataFilterOptions[idx].options) {
    Object.keys(reqState.dataFilterOptions[idx].options).forEach((key) => {
      const value = reqState.dataFilterOptions[idx].options[key];
      if (value !== 'DEFAULT' && value !== undefined) {
        resObject[key] = value;
      }
    });
  }
  return resObject;
};

const getToken = (token) => {
  if (token) {
    return token;
  } else {
    return '<YOU NEED TO LOGIN TO GET A TOKEN>';
  }
};

export const generateProcessCurlCommand = (reqState, token) => {
  const body = getJSONRequestBody(reqState);
  const curlCommand = `curl -X POST ${getUrl(
    reqState,
  )} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${getToken(token)}' \n -d '${body}'`;
  return curlCommand;
};

export const generateAxiosRequest = (requestState, token, reqConfig) => {
  try {
    const body = getJSONRequestBody(requestState);
    const config = getProcessRequestConfig(token, reqConfig, requestState);
    const url = getUrl(requestState);
    return Axios.post(url, body, config);
  } catch (err) {
    return null;
  }
};

export const getProcessRequestConfig = (token, reqConfig, reqState) => {
  const shouldAcceptTar = Boolean(reqState.responses.length > 1);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
    ...reqConfig,
  };
  if (shouldAcceptTar) {
    config.headers.Accept = 'application/tar';
  }
  return config;
};

export const getCustomCollections = (token, location) => {
  const url = byocLocationToBaseUrl(location) + 'api/v1/byoc/collections';
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  return Axios.get(url, config);
};

export const convertEvalscript = (evalscript, datasource, token, reqConfig) => {
  const url = `${DATASOURCES[datasource].url}/convertscript?datasetType=${datasource}`;
  const config = {
    headers: {
      'Content-Type': 'application/ecmascript',
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
  return Axios.post(url, evalscript, config);
};
