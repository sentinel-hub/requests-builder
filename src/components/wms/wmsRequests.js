import axios from 'axios';
import { isBbox, transformGeometryToNewCrs } from '../common/Map/utils/crsTransform';
import BBox from '@turf/bbox';
import { DATASOURCES } from '../../utils/const';

const getConfigHelper = (token, reqConfig) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
};

const BASE_WMS_URL = 'https://services.sentinel-hub.com/configuration/v1/wms/instances/';

export const getAllInstances = (token, reqConfig) => {
  const url = BASE_WMS_URL;
  const config = getConfigHelper(token, reqConfig);
  return axios.get(url, config);
};

export const getLayersByInstanceId = (token, instanceId) => {
  const url = `${BASE_WMS_URL}${instanceId}/layers`;
  const config = getConfigHelper(token);
  return axios.get(url, config);
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

const crsToWMSCrs = {
  'EPSG:3857': 'EPSG:3857',
  'EPSG:4326': 'CRS:84',
};

const getWMSBbox = (requestState, mode = 'WMS') => {
  const geometry = requestState.geometry;
  let geoString = '';
  const transformedGeo = transformGeometryToNewCrs(geometry, requestState.CRS);
  if (isBbox(geometry)) {
    geoString = `BBOX=${transformedGeo[0]},${transformedGeo[1]},${transformedGeo[2]},${transformedGeo[3]}`;
  } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    // create bbox
    const bbox = BBox(transformedGeo);
    const stringBbox = `BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&`;
    if (mode === 'WMS') {
      geoString += stringBbox;
    }
    //add geometry
    geoString += `GEOMETRY=${getPolygonWKT(transformedGeo)}`;
  }
  return geoString;
};

const getWidthOrResWms = (requestState) => {
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
      advancedOptionsString += `&${key}=${wmsState.advancedOptions[key]}`;
    }
  });
  return advancedOptionsString;
};

const getWmsRequestParams = (requestState, wmsState, request = 'GetMap') => {
  let params = '';
  params += `REQUEST=${request}&`;
  params += `CRS=${crsToWMSCrs[requestState.CRS]}&`;
  params += `${getWMSBbox(requestState)}&`;
  params += `LAYERS=${wmsState.layerId}&`;
  params += `${getWidthOrResWms(requestState)}&`;
  params += `FORMAT=${requestState.responses[0].format}`;
  params += `${getWmsTime(requestState)}`;
  return params;
};

const getFisParams = (requestState, wmsState) => {
  let params = '';
  params += `LAYER=${wmsState.layerId}&`;
  params += `CRS=${crsToWMSCrs[requestState.CRS]}&`;
  params += `${getWMSBbox(requestState, 'FIS')}&`;
  params += `${getWidthOrResWms(requestState)}`;
  params += `${getWmsTime(requestState)}`;
  params += getOGCAdvancedOptions(wmsState);
  return params;
};

const getWcsParams = (wmsState) => {
  return `&COVERAGE=${wmsState.layerId}`;
};

const getServicesEndpoint = (datasource) => {
  return DATASOURCES[datasource] ? DATASOURCES[datasource].ogcUrl : 'https://services.sentinel-hub.com/ogc/';
};

export const getWmsUrl = (wmsState, requestState) => {
  return `${getServicesEndpoint(wmsState.datasource)}wms/${
    wmsState.instanceId ? wmsState.instanceId : '<your instance id>'
  }?${getWmsRequestParams(requestState, wmsState)}`;
};

export const getFisUrl = (wmsState, requestState) => {
  return `${getServicesEndpoint(wmsState.datasource)}fis/${
    wmsState.instanceId ? wmsState.instanceId : '<your instance id>'
  }?${getFisParams(requestState, wmsState)}`;
};

export const getWcsUrl = (wmsState, requestState) => {
  return `${getServicesEndpoint(wmsState.datasource)}wcs/${
    wmsState.instanceId ?? '<your instance id>'
  }?${getWmsRequestParams(requestState, wmsState, 'GetCoverage')}${getWcsParams(wmsState)}`;
};

export const getMapWms = (wmsState, requestState, token, reqConfig) => {
  const url = getWmsUrl(wmsState, requestState);
  const config = getConfigHelper(token, reqConfig);
  config.responseType = 'blob';
  return axios.get(url, config);
};

export const getFisStats = (wmsState, requestState, token, reqConfig) => {
  const url = getFisUrl(wmsState, requestState);
  const config = getConfigHelper(token, reqConfig);
  return axios.get(url, config);
};

export const getCoverageWcs = (wmsState, requestState, token, reqConfig) => {
  const url = getWcsUrl(wmsState, requestState);
  const config = getConfigHelper(token, reqConfig);
  config.responseType = 'blob';
  return axios.get(url, config);
};
