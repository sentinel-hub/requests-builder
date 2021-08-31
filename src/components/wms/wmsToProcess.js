import { getJSONRequestBody } from '../../api/process/utils';
import { OLD_DATASOURCES_TO_NEW_MAP } from '../../utils/const/const';
import { generateProcessCurlCommand } from '../process/lib/curls';

const DATAFILTER_KEYS = [
  'mosaickingOrder',
  'maxCloudCoverage',
  'resolution',
  'acquisitionMode',
  'polarization',
  'orbitDirection',
];
const PROCESSING_KEYS = [
  'backCoeff',
  'orthorectify',
  'timeliness',
  'demInstance',
  'clampNegative',
  'EGM',
  'view',
];

const getDataFilterOptionsFromLayer = (layer) => {
  const { otherDefaults } = layer;
  const filtered = Object.entries(otherDefaults)
    .filter(([key]) => DATAFILTER_KEYS.includes(key))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  return filtered;
};

const getProcessingOptionsFromLayer = (layer) => {
  const { otherDefaults } = layer;
  const filtered = Object.entries(otherDefaults)
    .filter(([key]) => PROCESSING_KEYS.includes(key))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  return filtered;
};

const layerToRequestState = (layer, requestState) => {
  const finalReqState = {
    dataCollections: [
      {
        type: OLD_DATASOURCES_TO_NEW_MAP[layer.datasource],
        byocCollectionType: layer.otherDefaults?.subType ?? 'BYOC',
        byocCollectionId: layer.otherDefaults?.collectionId ?? '',
      },
    ],
    timeFrom: requestState.timeFrom,
    timeTo: requestState.timeTo,
    isTimeRangeDisabled: requestState.isTimeRangeDisabled,
    responses: [requestState.responses[0]],
    heightOrRes: requestState.heightOrRes,
    width: requestState.width,
    height: requestState.height,
    isAutoRatio: requestState.isAutoRatio,
    dataFilterOptions: [{ options: getDataFilterOptionsFromLayer(layer), idx: 0 }],
    processingOptions: [{ options: getProcessingOptionsFromLayer(layer), idx: 0 }],
    evalscript: layer.styles[0]?.evalScript ?? '',
  };
  return finalReqState;
};

const wmsLayerToProcessRequest = (layer, requestState, mapState) => {
  return getJSONRequestBody(layerToRequestState(layer, requestState), mapState, true);
};

export const wmsLayerToCurl = (layer, requestState, mapState, token) => {
  return generateProcessCurlCommand(layerToRequestState(layer, requestState), mapState, token);
};

export default wmsLayerToProcessRequest;
