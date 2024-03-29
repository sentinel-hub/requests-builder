import axios from 'axios';
import { isBbox } from '../common/Map/utils/geoUtils';
import BBox from '@turf/bbox';
import { DATASOURCES } from '../../utils/const/const';
import { getBaseUrl, isOnDefaultUrl } from '../../api/url';
import { typenameForCollection } from './WfsAdvancedOptions';

const getConfigHelper = (token, reqConfig) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
};

const getPolygonWKT = (geoJsonPolygon) => {
  if (geoJsonPolygon.type === 'MultiPolygon') {
    return `POLYGON (${geoJsonPolygon.coordinates[0].map((listOfCoords) => {
      return (
        '(' +
        listOfCoords.map((pair) => {
          return `${pair[0]} ${pair[1]}`;
        }) +
        ')'
      );
    })})`;
  } else {
    return `POLYGON ((${geoJsonPolygon.coordinates[0].map((pair) => {
      return `${pair[0]} ${pair[1]}`;
    })}))`;
  }
};

export const crsToWMSCrs = {
  'EPSG:3857': 'EPSG:3857',
  'EPSG:4326': 'CRS:84',
};

export const WmsCrsToCrs = {
  'EPSG:3857': 'EPSG:3857',
  'CRS:84': 'EPSG:4326',
};

const getWMSBbox = (mapState, mode = 'WMS') => {
  const geometry = mapState.convertedGeometry;
  let geoString = '';
  if (isBbox(geometry)) {
    geoString = `BBOX=${geometry[0]},${geometry[1]},${geometry[2]},${geometry[3]}`;
  } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    // create bbox
    const bbox = BBox(geometry);
    const stringBbox = `BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&`;
    if (mode === 'WMS') {
      geoString += stringBbox;
    }
    //add geometry
    geoString += `GEOMETRY=${getPolygonWKT(geometry)}`;
  }
  return geoString;
};

const getWidthOrResWms = (requestState) => {
  // OGC supports res in meters (e.g: RESX=20m)
  if (requestState.heightOrRes === 'RES' && requestState.isOnAutoRes) {
    return `RESX=${requestState.width}m&RESY=${requestState.height}m`;
  }
  if (requestState.heightOrRes === 'HEIGHT') {
    return `WIDTH=${parseInt(requestState.width, 10)}&HEIGHT=${parseInt(requestState.height, 10)}`;
  }
  return `RESX=${requestState.width}&RESY=${requestState.height}`;
};

const getWmsTime = (requestState) => {
  if (requestState.isTimeRangeDisabled) {
    return '';
  }
  const { timeTo, timeFrom } = requestState;
  if (timeTo[0] && timeFrom[0]) {
    return '&TIME=' + timeFrom[0].split('T')[0] + '/' + timeTo[0].split('T')[0];
  }
};

const getOGCAdvancedOptions = (wmsState) => {
  let advancedOptionsString = '';
  Object.keys(wmsState.advancedOptions).forEach((key) => {
    if (wmsState.advancedOptions[key]) {
      advancedOptionsString += `&${key.toUpperCase()}=${wmsState.advancedOptions[key]}`;
    }
  });
  return advancedOptionsString;
};

const getWmsRequestParams = (requestState, wmsState, mapState, request = 'GetMap') => {
  let params = '';
  params += `REQUEST=${request}&`;
  params += `CRS=${crsToWMSCrs[mapState.selectedCrs]}&`;
  params += `${getWMSBbox(mapState)}&`;
  params += `LAYERS=${wmsState.layer.id}&`;
  params += `${getWidthOrResWms(requestState)}&`;
  params += `FORMAT=${requestState.responses[0].format}`;
  params += `${getWmsTime(requestState)}`;
  return params;
};

const getFisParams = (requestState, wmsState, mapState) => {
  let params = '';
  params += `LAYER=${wmsState.layer.id ?? '<layer>'}&`;
  params += `CRS=${crsToWMSCrs[mapState.selectedCrs]}&`;
  params += `${getWMSBbox(mapState, 'FIS')}&`;
  params += `${getWidthOrResWms(requestState)}`;
  params += `${getWmsTime(requestState)}`;
  params += getOGCAdvancedOptions(wmsState);
  return params;
};

const getWfsRequestParams = (requestState, wmsState, mapState) => {
  let params = '';
  params += `REQUEST=GetFeature&`;
  params += `LAYER=${wmsState.layer.id ?? '<layer>'}&`;
  params += `CRS=${crsToWMSCrs[mapState.selectedCrs]}&`;
  params += `${getWMSBbox(mapState)}`;
  params += `${getWmsTime(requestState)}`;
  params += getOGCAdvancedOptions(wmsState);
  return params;
};

const getWmtsRequestParams = (requestState, wmsState) => {
  let params = '';
  params += `REQUEST=GetTile&`;
  params += `LAYER=${wmsState.layer.id ?? '<layer>'}`;
  params += `${getWmsTime(requestState)}`;
  params += getOGCAdvancedOptions(wmsState);
  params += `&FORMAT=${requestState.responses[0].format}`;
  return params;
};

const getWcsParams = (wmsState) => {
  return `&COVERAGE=${wmsState.layer.id}`;
};

const getWfsParams = (wmsState) => {
  return `&TYPENAMES=${typenameForCollection(
    wmsState.datasource,
    wmsState.byocCollectionType,
    wmsState.byocCollection,
  )}&OUTPUTFORMAT=application/json`;
};

const getServicesEndpoint = (datasource) => {
  if (isOnDefaultUrl()) {
    return DATASOURCES[datasource]
      ? DATASOURCES[datasource].ogcUrl
      : 'https://services.sentinel-hub.com/ogc/';
  }
  return `${getBaseUrl()}/ogc/`;
};

export const getWmsUrl = (wmsState, requestState, mapState) => {
  return `${getServicesEndpoint(wmsState.datasource)}wms/${
    wmsState.instanceId ? wmsState.instanceId : '<your instance id>'
  }?${getWmsRequestParams(requestState, wmsState, mapState)}`;
};

export const getFisUrl = (wmsState, requestState, mapState) => {
  return `${getServicesEndpoint(wmsState.datasource)}fis/${
    wmsState.instanceId ? wmsState.instanceId : '<your instance id>'
  }?${getFisParams(requestState, wmsState, mapState)}`;
};

export const getWcsUrl = (wmsState, requestState, mapState) => {
  return `${getServicesEndpoint(wmsState.datasource)}wcs/${
    wmsState.instanceId ?? '<your instance id>'
  }?${getWmsRequestParams(requestState, wmsState, mapState, 'GetCoverage')}${getWcsParams(wmsState)}`;
};

export const getWfsUrl = (wmsState, requestState, mapState) => {
  return `${getServicesEndpoint(wmsState.datasource)}wfs/${
    wmsState.instanceId ?? '<your instance id>'
  }?${getWfsRequestParams(requestState, wmsState, mapState)}${getWfsParams(wmsState)}`;
};

export const getWmtsUrl = (wmsState, requestState) => {
  return `${getServicesEndpoint(wmsState.datasource)}wmts/${
    wmsState.instanceId ?? '<your instance id>'
  }?${getWmtsRequestParams(requestState, wmsState)}`;
};

export const getMapWms = (wmsState, requestState, mapState, token, reqConfig) => {
  const url = getWmsUrl(wmsState, requestState, mapState);
  const config = getConfigHelper(token, reqConfig);
  config.responseType = 'blob';
  return axios.get(url, config);
};

export const getFisStats = (wmsState, requestState, mapState, token, reqConfig) => {
  const url = getFisUrl(wmsState, requestState, mapState);
  const config = getConfigHelper(token, reqConfig);
  return axios.get(url, config);
};

export const getCoverageWcs = (wmsState, requestState, mapState, token, reqConfig) => {
  const url = getWcsUrl(wmsState, requestState, mapState);
  const config = getConfigHelper(token, reqConfig);
  config.responseType = 'blob';
  return axios.get(url, config);
};

export const getFeaturesWfs = (wmsState, requestState, mapState, token, reqConfig) => {
  const url = getWfsUrl(wmsState, requestState, mapState);
  const config = getConfigHelper(token, reqConfig);
  config.responseType = 'application/json';
  return axios.get(url, config);
};

export const getTileWmts = (wmsState, requestState, mapState, token, reqConfig) => {
  const url = getWmtsUrl(wmsState, requestState);
  const config = getConfigHelper(token, reqConfig);
  config.responseType = 'blob';
  return axios.get(url, config);
};

const fetchEvalscript = (dataProductUrl, token) => {
  const config = getConfigHelper(token);
  return axios.get(dataProductUrl, config);
};
//evalScript should be present
export const fetchEvalscripts = async (layers, token) => {
  return Promise.all(
    layers.map(async (layer) => {
      if (layer.styles[0]?.dataProduct) {
        const res = await fetchEvalscript(layer.styles[0].dataProduct['@id'], token);
        return { ...layer, styles: [{ ...layer.styles, evalScript: res.data.evalScript }] };
      }
      return layer;
    }),
  );
};
