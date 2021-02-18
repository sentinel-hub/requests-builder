import omit from 'lodash.omit';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { DATASOURCES_NAMES, CRS, OUTPUT_FORMATS, CUSTOM } from '../../../utils/const';
import { calculateMaxMetersPerPixel } from '../../common/Map/utils/bboxRatio';
import { transformGeometryToNewCrs } from '../../common/Map/utils/crsTransform';

const dispatchEvalscript = (parsedBody) => {
  try {
    const { evalscript } = parsedBody;
    if (evalscript) {
      store.dispatch(requestSlice.actions.setEvalscript(evalscript));
    }
  } catch (err) {
    console.error('Error while parsing evalscript', err);
  }
};

export const dispatchBounds = (parsedBody) => {
  try {
    let bounds = parsedBody.input.bounds;
    //crs
    const crs = bounds.properties?.crs ?? undefined;
    let selectedCrs;
    if (crs) {
      selectedCrs = Object.keys(CRS).find((key) => CRS[key].url === crs);
      if (selectedCrs) {
        store.dispatch(requestSlice.actions.setCRS(selectedCrs));
      }
    } else {
      selectedCrs = 'EPSG:4326';
      store.dispatch(requestSlice.actions.setCRS(selectedCrs));
    }
    //is bbox
    if (bounds.bbox) {
      let geometry = bounds.bbox;
      // if not wgs84 -> transform to it
      if (selectedCrs !== 'EPSG:4326') {
        geometry = transformGeometryToNewCrs(bounds.bbox, 'EPSG:4326', selectedCrs);
      }
      store.dispatch(requestSlice.actions.setGeometry(geometry));
    }
    //polygon
    else if (bounds.geometry) {
      let geometry = bounds.geometry;
      if (selectedCrs !== 'EPSG:4326') {
        geometry = transformGeometryToNewCrs(geometry, 'EPSG:4326', selectedCrs);
      }
      store.dispatch(requestSlice.actions.setGeometry(geometry));
    }
  } catch (err) {
    console.error('Error while parsing geometry', err);
  }
};

const dispatchTimeRange = (parsedBody) => {
  try {
    const validTimeRanges = parsedBody.input.data
      .map((bodyInputData) => {
        let timeRange = bodyInputData.dataFilter?.timeRange;
        let timeTo = timeRange?.to;
        let timeFrom = timeRange?.from;
        if (timeTo && timeFrom) {
          return { timeTo, timeFrom };
        }
        return undefined;
      })
      .filter((t) => t);
    if (validTimeRanges.length > 0) {
      store.dispatch(requestSlice.actions.setTimeRanges(validTimeRanges));
    } else {
      store.dispatch(requestSlice.actions.disableTimerange(true));
    }
  } catch (err) {
    console.error('Error while parsing timerange', err);
  }
};

const handleDatafusionParsing = (parsedBody) => {
  store.dispatch(requestSlice.actions.setDatasource('DATAFUSION'));
  let dataFusionSources = [];
  parsedBody.input.data.forEach((data) => {
    dataFusionSources.push({ datasource: data.type, id: data.id ? data.id : '' });
  });
  store.dispatch(requestSlice.actions.setDatafusionSourcesAbs(dataFusionSources));
};

const handleOldByocParsing = (parsedBody) => {
  // {type: 'CUSTOM', dataFilter: {collectionId: <id>}}
  store.dispatch(requestSlice.actions.setByocCollectionType('BYOC'));
  if (parsedBody.input.data[0].dataFilter.collectionId) {
    store.dispatch(
      requestSlice.actions.setByocCollectionId(parsedBody.input.data[0].dataFilter.collectionId),
    );
  }
};

const handleByocParsing = (datasource) => {
  // {type: byoc-<id>}
  const [type, ...rest] = datasource.split('-');
  store.dispatch(requestSlice.actions.setDatasource(CUSTOM));
  store.dispatch(requestSlice.actions.setByocCollectionId(rest.join('-')));
  store.dispatch(requestSlice.actions.setByocCollectionType(type.toUpperCase()));
};

export const dispatchDatasource = (parsedBody) => {
  try {
    if (parsedBody.input.data.length > 1) {
      handleDatafusionParsing(parsedBody);
      return;
    }
    const datasource = parsedBody.input.data[0].type;
    const validDatasource = DATASOURCES_NAMES.find((d) => d === datasource);
    if (validDatasource) {
      store.dispatch(requestSlice.actions.setDatasource(validDatasource));
      if (validDatasource === CUSTOM) {
        handleOldByocParsing(parsedBody);
        return;
      }
    }
    if (datasource.includes('byoc-') || datasource.includes('batch-')) {
      handleByocParsing(datasource);
      return;
    }
  } catch (err) {
    console.error('Error while parsing datasources', err);
  }
};

// Should keep ratio if dimension are close to 5% to geometry ratio.
const shouldKeepRatio = (geometry, width, height) => {
  if (!geometry) {
    return true;
  }
  const dimensionsRatio = width / height;
  const [x, y] = calculateMaxMetersPerPixel(geometry);
  const geometryRatio = x / y;
  return Math.abs(geometryRatio - dimensionsRatio) <= 0.05 * geometryRatio;
};

const dispatchDimensions = (parsedBody) => {
  try {
    const {
      output,
      input: { bounds },
    } = parsedBody;
    const width = output.width;
    const height = output.height;
    const geometry = bounds.geometry ? bounds.geometry : bounds.bbox;
    const keepRatio = shouldKeepRatio(geometry, width, height);

    if (keepRatio) {
      store.dispatch(requestSlice.actions.setIsAutoRatio(true));
    } else {
      store.dispatch(requestSlice.actions.setIsAutoRatio(false));
    }
    if (height && width) {
      store.dispatch(requestSlice.actions.setHeightOrRes('HEIGHT'));
      store.dispatch(requestSlice.actions.setWidth(width));
      store.dispatch(requestSlice.actions.setHeight(height));
    }

    const resx = output.resx;
    const resy = output.resy;

    if (resx && resy) {
      store.dispatch(requestSlice.actions.setIsOnAutoRes(false));
      store.dispatch(requestSlice.actions.setHeightOrRes('RES'));
      store.dispatch(requestSlice.actions.setWidth(resx));
      store.dispatch(requestSlice.actions.setHeight(resy));
    }
  } catch (err) {
    console.error('Error while parsing dimensions', err);
  }
};

const dispatchResponses = (parsedBody) => {
  //Helper function to check format of response.
  const validFormat = (formatString) => {
    return Boolean(OUTPUT_FORMATS.find((format) => format.value === formatString));
  };

  try {
    const responses = parsedBody.output.responses;
    if (responses && responses.length > 0) {
      const validResponses = responses
        .map((resp, idx) => {
          if (resp.identifier && validFormat(resp.format.type)) {
            return { identifier: resp.identifier, format: resp.format.type, idx: idx };
          } else {
            return undefined;
          }
        })
        .filter((n) => n);
      store.dispatch(requestSlice.actions.setResponses(validResponses));
    }
  } catch (err) {
    console.error('Error while parsing responses', err);
  }
};

export const dispatchAdvancedOptions = (parsedBody) => {
  // timeRange and collectionId are handled somewhere else.
  const omittedDataFilterProperties = ['collectionId', 'timeRange'];
  try {
    if (parsedBody.input.data.length > 0) {
      parsedBody.input.data.forEach((data, idx) => {
        const dataFilterOptions = omit(data.dataFilter, omittedDataFilterProperties);

        if (dataFilterOptions && Object.keys(dataFilterOptions).length > 0) {
          dataFilterOptions.idx = idx;
          store.dispatch(requestSlice.actions.setDataFilterOptions(dataFilterOptions));
        }

        const processingOptions = data.processing;
        if (processingOptions) {
          processingOptions.idx = idx;
          store.dispatch(requestSlice.actions.setProcessingOptions(processingOptions));
        }
      });
    }
  } catch (err) {
    console.error('Error while parsing advanced options', err);
  }
};

export const dispatchChanges = (parsedBody) => {
  store.dispatch(requestSlice.actions.resetAdvancedOptions());
  dispatchEvalscript(parsedBody);
  dispatchBounds(parsedBody);
  dispatchTimeRange(parsedBody);
  dispatchDatasource(parsedBody);
  dispatchDimensions(parsedBody);
  dispatchResponses(parsedBody);
  dispatchAdvancedOptions(parsedBody);
};

// Return the json body of a curl command.
export const getRequestBody = (curlString) => {
  const bodyCharList = [];
  let firstCurlyEncountered = false;
  for (let char of curlString) {
    if (char === '{' && !firstCurlyEncountered) {
      firstCurlyEncountered = true;
    }
    if (firstCurlyEncountered) {
      bodyCharList.push(char);
    }
  }
  while (bodyCharList[bodyCharList.length - 1] !== '}' && bodyCharList.length > 0) {
    bodyCharList.pop();
  }
  return bodyCharList.join('');
};

export const getEvalscript = (evalscriptString) => {
  const evalscriptCharList = [];
  let equalEncountered = false;
  for (let char of evalscriptString) {
    if (equalEncountered) {
      evalscriptCharList.push(char);
    }
    if (char === '=' && !equalEncountered) {
      equalEncountered = true;
    }
  }

  while (evalscriptCharList[evalscriptCharList.length - 1] !== "'" && evalscriptCharList.length > 0) {
    evalscriptCharList.pop();
  }

  evalscriptCharList.pop();

  return evalscriptCharList.join('');
};

export const getUrlFromCurl = (curlCommand) => {
  return curlCommand.split(' ')[3];
};
