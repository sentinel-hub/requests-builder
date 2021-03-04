import axios from 'axios';
import { isBbox } from '../common/Map/utils/crsTransform';
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
  params += `LAYER=${wmsState.layer.id}&`;
  params += `CRS=${crsToWMSCrs[mapState.selectedCrs]}&`;
  params += `${getWMSBbox(mapState, 'FIS')}&`;
  params += `${getWidthOrResWms(requestState)}`;
  params += `${getWmsTime(requestState)}`;
  params += getOGCAdvancedOptions(wmsState);
  return params;
};

const getWcsParams = (wmsState) => {
  return `&COVERAGE=${wmsState.layer.id}`;
};

const getServicesEndpoint = (datasource) => {
  return DATASOURCES[datasource] ? DATASOURCES[datasource].ogcUrl : 'https://services.sentinel-hub.com/ogc/';
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
