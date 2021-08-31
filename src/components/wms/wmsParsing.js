import store from '../../store';
import { addWarningAlert } from '../../store/alert';
import mapSlice from '../../store/map';
import requestSlice from '../../store/request';
import wmsSlice from '../../store/wms';
import { WmsCrsToCrs } from './wmsRequests';

const getOgcUrl = (text) => {
  try {
    return new URL(text);
  } catch (err) {
    addWarningAlert('Invalid URL');
    return;
  }
};

const getWmsLayer = (searchParams, wmsService) => {
  if (wmsService === 'wms') {
    return searchParams.get('LAYERS');
  }
  return searchParams.get('LAYER');
};

const NOT_ADVANCED_PARAMETERS = [
  'CRS',
  'BBOX',
  'GEOMETRY',
  'WIDTH',
  'HEIGHT',
  'TIME',
  'FORMAT',
  'RESOLUTION',
  'TYPENAMES',
];
const ADVANCED_PARAMETERS = [
  'STYLE',
  'BINS',
  'MAXFEATURES',
  'FEATURESOFFSET',
  'TILEMATRIXSET',
  'TILEMATRIX',
  'TILEROW',
  'TILECOL',
];
const getAdvancedParamters = (searchParams) => {
  const advancedParams = [];
  for (let entry of searchParams.entries()) {
    if (!NOT_ADVANCED_PARAMETERS.includes(entry[0]) && ADVANCED_PARAMETERS.includes(entry[0])) {
      advancedParams.push(entry);
    }
  }
  return Object.fromEntries(advancedParams);
};

const handleWmsTimeParsing = (timeStr) => {
  const [from, to] = timeStr.split('/');
  store.dispatch(requestSlice.actions.setTimeFrom({ idx: 0, timeFrom: from }));
  store.dispatch(requestSlice.actions.setTimeTo({ idx: 0, timeTo: to }));
};

const wktBboxToBbox = (bboxStr) => bboxStr.split(',').map(Number);
const wktGeometryToGeometry = (wktGeoStr) => {
  const [type] = wktGeoStr.match(/\w+/);
  if (type === 'POLYGON') {
    return {
      type: 'Polygon',
      coordinates: [
        wktGeoStr
          .match(/(?<=\(\().*?(?=\)\))/)[0]
          .split(',')
          .map((pair) => pair.split(' ').map(Number)),
      ],
    };
  }
};

const parseWmsText = (text) => {
  const url = getOgcUrl(text);
  if (url) {
    const [, wmsService, instanceId] = url.pathname.slice(1).split('/');
    if (instanceId) {
      store.dispatch(wmsSlice.actions.setInstanceId(instanceId));
    }
    if (!wmsService) {
      return;
    }
    store.dispatch(wmsSlice.actions.setMode(wmsService.toUpperCase()));

    const searchParams = url.searchParams;
    const layer = getWmsLayer(searchParams, wmsService);
    if (layer) {
      store.dispatch(wmsSlice.actions.setShouldFetchLayers(true));
      store.dispatch(
        wmsSlice.actions.setLayer({
          id: layer,
        }),
      );
    }

    const crs = searchParams.get('CRS');
    if (crs && WmsCrsToCrs[crs]) {
      store.dispatch(mapSlice.actions.setSelectedCrs(WmsCrsToCrs[crs]));
    }

    const bbox = searchParams.get('BBOX');
    const geometry = searchParams.get('GEOMETRY');
    if (bbox && !geometry) {
      const properBbox = wktBboxToBbox(bbox);
      store.dispatch(mapSlice.actions.setTextGeometry(properBbox));
    } else if (geometry) {
      const geo = wktGeometryToGeometry(geometry);
      store.dispatch(mapSlice.actions.setTextGeometry(geo));
    }

    const width = searchParams.get('WIDTH');
    const height = searchParams.get('HEIGHT');
    const resolution = searchParams.get('RESOLUTION');
    if (Number(width) && Number(height)) {
      store.dispatch(requestSlice.actions.setHeight(Number(height)));
      store.dispatch(requestSlice.actions.setWidth(Number(width)));
    } else if (Number(resolution)) {
      store.dispatch(requestSlice.actions.setHeightOrRes('RES'));
      store.dispatch(requestSlice.actions.setHeight(Number(resolution)));
      store.dispatch(requestSlice.actions.setWidth(Number(resolution)));
    }

    const time = searchParams.get('TIME');
    if (time) {
      handleWmsTimeParsing(time);
    }

    const format = searchParams.get('FORMAT');
    if (format) {
      store.dispatch(requestSlice.actions.setResponse({ idx: 0, format: format }));
    }

    const advancedParams = getAdvancedParamters(searchParams);
    store.dispatch(wmsSlice.actions.setAdvancedOptions(advancedParams));
  }
};

export default parseWmsText;
