import axios from 'axios';
import { isBbox, isMultiPolygon, isPolygon } from '../../components/common/Map/utils/crsTransform';
import { getRequestBody, getUrlFromCurl } from '../../components/process/requests/parseRequest';
import { CRS, CUSTOM, DATAFUSION, DATASOURCES, isEmpty } from '../../utils/const';

export const byocLocationToBaseUrl = (location) => {
  if (location === 'EU-CENTRAL-1') {
    return 'https://services.sentinel-hub.com/';
  } else if (location === 'US-WEST-2') {
    return 'https://services-uswest2.sentinel-hub.com/';
  }
  return 'https://services.sentinel-hub.com/';
};

export const getUrl = (requestState) => {
  if (requestState.datasource === CUSTOM) {
    return byocLocationToBaseUrl(requestState.byocLocation) + 'api/v1/process';
  } else {
    return DATASOURCES[requestState.datasource].url;
  }
};

export const getJSONRequestBody = (reqState, mapState, formated = true) => {
  const requestBody = getRequestObject(reqState, mapState);
  if (formated) {
    return JSON.stringify(requestBody, null, 2);
  }
  return JSON.stringify(requestBody);
};

export const getRequestObject = (reqState, mapState) => {
  const requestBody = {
    input: {
      bounds: {
        ...generateBounds(mapState),
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
export const getEvalscriptDebuggerHelper = (evalscript) => {
  if (!evalscript.includes('console.log(')) {
    return evalscript;
  } else {
    const { contents, newEvalscript } = getConsoleLogContents(evalscript);
    const consoleLogContents = processConsoleLogContents(contents);
    let returnVal = newEvalscript.replace('console.log', 'throw new Error' + consoleLogContents);
    return returnVal;
  }
};

const getRequestData = (reqState) => {
  if (reqState.datasource === DATAFUSION) {
    return reqState.datafusionSources.map((source, idx) => ({
      type: source.datasource,
      id: source.id,
      ...getDataFilter(reqState, idx),
      ...getProcessingOptions(reqState, idx),
    }));
  }
  if (reqState.datasource === CUSTOM) {
    return [
      {
        type: `${reqState.byocCollectionType.toLowerCase()}-${reqState.byocCollectionId}`,
        ...getDataFilter(reqState),
        ...getProcessingOptions(reqState),
      },
    ];
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

const getBoundsProperties = (crs) => {
  if (crs === 'EPSG:4326') {
    // non properties is required to demo tpdi orders.
    return {};
  }
  return {
    properties: {
      crs: CRS[crs].url,
    },
  };
};

export const generateBounds = (mapState) => {
  if (isPolygon(mapState.convertedGeometry) || isMultiPolygon(mapState.convertedGeometry)) {
    return {
      geometry: mapState.convertedGeometry,
      ...getBoundsProperties(mapState.selectedCrs),
    };
  } else if (isBbox(mapState.convertedGeometry)) {
    return {
      bbox: mapState.convertedGeometry,
      ...getBoundsProperties(mapState.selectedCrs),
    };
  }
  return {};
};

const generateOutput = (state) => {
  let { width, height } = state;
  width = Number(width);
  height = Number(height);
  //HEIGHT or RES
  if (state.heightOrRes === 'HEIGHT') {
    return {
      width,
      height,
    };
  } else if (state.heightOrRes === 'RES') {
    if (state.isOnAutoRes) {
      return {
        width,
        height,
      };
    }
    return {
      resx: width,
      resy: height,
    };
  }
};

const generateResponses = (reqState) =>
  reqState.responses.map((resp) => ({ identifier: resp.identifier, format: { type: resp.format } }));

export const getNonDefaultOptions = (options) => {
  const resOptions = {};
  if (options) {
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (value !== 'DEFAULT' && value !== undefined) {
        resOptions[key] = value;
      }
    });
  }
  return resOptions;
};

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

export const sendProcessBody = (token, body, url, reqConfig) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
    ...reqConfig,
  };
  if (body.output?.responses?.length > 1) {
    config.headers.Accept = 'application/tar';
  }
  return axios.post(url, body, config);
};

export const sendEditedRequest = (token, text, reqConfig) => {
  const url = getUrlFromCurl(text);
  const body = getRequestBody(text);
  const parsed = JSON.parse(body);
  return sendProcessBody(token, parsed, url, reqConfig);
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
