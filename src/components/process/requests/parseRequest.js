import omit from 'lodash.omit';
import store from '../../../store';
import { addWarningAlert } from '../../../store/alert';
import mapSlice from '../../../store/map';
import requestSlice from '../../../store/request';
import {
  DATASOURCES_NAMES,
  OUTPUT_FORMATS,
  CUSTOM,
  OLD_DATASOURCES_TO_NEW_MAP,
} from '../../../utils/const/const';
import { CRS } from '../../../utils/const/constMap';
import { calculateMaxMetersPerPixel } from '../../common/Map/utils/bboxRatio';
import { isValidBbox, isValidGeometry } from '../../common/Map/utils/crsTransform';

const dispatchEvalscript = (parsedBody) => {
  const { evalscript } = parsedBody;
  if (evalscript) {
    store.dispatch(requestSlice.actions.setEvalscript(evalscript));
  }
};

export const crsByUrl = (url) => Object.keys(CRS).find((key) => CRS[key].url === url);

export const dispatchBounds = (parsedBody) => {
  try {
    let bounds = parsedBody.input?.bounds;
    //crs
    const crsUrl = bounds?.properties?.crs ?? undefined;
    let selectedCrs;
    if (crsUrl) {
      selectedCrs = crsByUrl(crsUrl);
      if (!selectedCrs) {
        selectedCrs = 'EPSG:4326';
      }
    }
    //is bbox
    if (bounds.bbox) {
      let geometry = bounds.bbox;
      if (isValidBbox(bounds.bbox)) {
        store.dispatch(mapSlice.actions.setConvertedGeometryWithCrs({ geometry, crs: selectedCrs }));
      } else {
        throw Error('Unvalid bbox');
      }
    }
    //polygon
    else if (bounds.geometry) {
      if (isValidGeometry(bounds.geometry)) {
        let geometry = bounds.geometry;
        store.dispatch(mapSlice.actions.setConvertedGeometryWithCrs({ geometry, crs: selectedCrs }));
      } else {
        throw Error('Unable to parse geometry');
      }
    }
  } catch (err) {
    return err.message ?? 'Error while parsing geometry';
  }
};

const dispatchTimeRange = (parsedBody) => {
  try {
    const validTimeRanges = parsedBody.input?.data
      ? parsedBody.input?.data
          .map((bodyInputData) => {
            let timeRange = bodyInputData.dataFilter?.timeRange;
            let timeTo = timeRange?.to;
            let timeFrom = timeRange?.from;
            if (timeTo && timeFrom) {
              return { timeTo, timeFrom };
            }
            return undefined;
          })
          .filter((t) => t)
      : undefined;
    if (validTimeRanges && validTimeRanges.length > 0) {
      store.dispatch(requestSlice.actions.setTimeRanges(validTimeRanges));
    } else {
      store.dispatch(requestSlice.actions.disableTimerange(true));
    }
  } catch (err) {
    const errMsg = 'Error while parsing timerange';
    return errMsg;
  }
};

const handleOldByocParsing = (parsedBody, idx) => {
  store.dispatch(requestSlice.actions.setByocCollectionType({ idx, type: 'BYOC' }));
  if (parsedBody.input.data[idx]?.dataFilter?.collectionId) {
    store.dispatch(
      requestSlice.actions.setByocCollectionId({ idx, id: parsedBody.input.data[0].dataFilter.collectionId }),
    );
  }
};

const handleByocParsing = (dataObject, idx) => {
  // {type: byoc-<id>}
  const dataCollection = dataObject.type;
  const [type, ...rest] = dataCollection.split('-');
  store.dispatch(requestSlice.actions.setDataCollection({ idx, dataCollection: CUSTOM }));
  store.dispatch(requestSlice.actions.setByocCollectionId({ idx, id: rest.join('-') }));
  store.dispatch(requestSlice.actions.setByocCollectionType({ idx, type: type.toUpperCase() }));
};

export const getProperDataCollectionType = (datasource) => {
  const validDatasource = DATASOURCES_NAMES.find((d) => d === datasource);
  if (validDatasource !== undefined) {
    return validDatasource;
  }
  const oldDataCol = Object.keys(OLD_DATASOURCES_TO_NEW_MAP).find((d) => d === datasource);
  if (oldDataCol !== undefined) {
    return OLD_DATASOURCES_TO_NEW_MAP[oldDataCol];
  }
  return undefined;
};

export const dispatchDatasource = (parsedBody) => {
  const data = parsedBody.input?.data;
  if (data === undefined) {
    return;
  }
  if (data.length > 0)
    data.forEach((dataObject, idx) => {
      if (idx > 0) {
        // add data collection;
        store.dispatch(requestSlice.actions.addDataCollection());
      }
      const { type } = dataObject;
      const dataCollection = getProperDataCollectionType(type);
      if (dataCollection) {
        store.dispatch(requestSlice.actions.setDataCollection({ idx, dataCollection }));
      }
      if (dataObject.id !== undefined) {
        store.dispatch(requestSlice.actions.setDataCollectionId({ idx, id: dataObject.id }));
      }
      if (type === CUSTOM) {
        handleOldByocParsing(parsedBody, idx);
        return;
      }
      if (type.includes('byoc-') || type.includes('batch-')) {
        handleByocParsing(dataObject, idx);
        return;
      }
    });
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
  const output = parsedBody.output;
  const bounds = parsedBody.input?.bounds;
  if (output === undefined) {
    return;
  }
  const width = output.width;
  const height = output.height;
  const geometry = bounds.geometry ? bounds.geometry : bounds.bbox;

  if (height && width && typeof height === 'number' && typeof width === 'number') {
    store.dispatch(requestSlice.actions.setHeightOrRes('HEIGHT'));
    store.dispatch(requestSlice.actions.setWidth(width));
    store.dispatch(requestSlice.actions.setHeight(height));
    const keepRatio = shouldKeepRatio(geometry, width, height);

    if (keepRatio) {
      store.dispatch(requestSlice.actions.setIsAutoRatio(true));
    } else {
      store.dispatch(requestSlice.actions.setIsAutoRatio(false));
    }
  }

  const resx = output.resx;
  const resy = output.resy;

  if (resx && resy && typeof resx === 'number' && typeof resy === 'number') {
    store.dispatch(requestSlice.actions.setIsOnAutoRes(false));
    store.dispatch(requestSlice.actions.setHeightOrRes('RES'));
    store.dispatch(requestSlice.actions.setWidth(resx));
    store.dispatch(requestSlice.actions.setHeight(resy));
  }
};

const dispatchResponses = (parsedBody) => {
  //Helper function to check format of response.
  const validFormat = (formatString) => {
    return Boolean(OUTPUT_FORMATS.find((format) => format.value === formatString));
  };
  const responses = parsedBody.output?.responses;
  if (responses && responses.length > 0) {
    const validResponses = responses
      .map((resp, idx) => {
        if (validFormat(resp.format.type)) {
          return { identifier: resp.identifier, format: resp.format.type, idx: idx };
        } else {
          return undefined;
        }
      })
      .filter((n) => n);
    if (validResponses.length > 0) {
      store.dispatch(requestSlice.actions.setResponses(validResponses));
    }
  }
};

export const dispatchAdvancedOptions = (parsedBody) => {
  // timeRange and collectionId are handled somewhere else.
  const omittedDataFilterProperties = ['collectionId', 'timeRange'];
  try {
    if (parsedBody.input?.data?.length > 0) {
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
    const errMsg = 'Error while parsing advanced options';
    console.error(errMsg, err);
    return errMsg;
  }
};

export const dispatchChanges = (parsedBody, resetMode = false) => {
  store.dispatch(requestSlice.actions.resetState({ resetMode }));
  let errors = [];
  dispatchEvalscript(parsedBody);
  errors.push(dispatchBounds(parsedBody));
  errors.push(dispatchTimeRange(parsedBody));

  dispatchDatasource(parsedBody);

  dispatchDimensions(parsedBody);

  dispatchResponses(parsedBody);

  errors.push(dispatchAdvancedOptions(parsedBody));
  errors = errors.filter((err) => err);
  if (errors.length > 0) {
    addWarningAlert(errors.join('\n'), 5000);
  }
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
