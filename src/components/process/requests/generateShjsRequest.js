import bbox from '@turf/bbox';
import {
  isEmpty,
  S2L2A,
  S2L1C,
  L8L1C,
  S1GRD,
  S3OLCI,
  S3SLSTR,
  S5PL2,
  MODIS,
  DEM,
  CUSTOM,
  DATAFUSION,
} from '../../../utils/const';
import { transformGeometryToNewCrs } from '../../common/Map/utils/crsTransform';

const datasourceToSHJSLayer = {
  [S2L2A]: 'S2L2ALayer',
  [S2L1C]: 'S2L1CLayer',
  [L8L1C]: 'Landsat8AWSLayer',
  [S1GRD]: 'S1GRDAWSEULayer',
  [S3OLCI]: 'S3OLCILayer',
  [S3SLSTR]: 'S3SLSTRLayer',
  [S5PL2]: 'S5PL2Layer',
  [MODIS]: 'MODISLayer',
  [DEM]: 'DEMLayer',
  [CUSTOM]: 'BYOCLayer',
  [DATAFUSION]: 'ProcessingDataFusionLayer',
};

const crsToSHJSCrs = {
  'EPSG:4326': 'CRS_EPSG4326',
  'EPSG:3857': 'CRS_EPSG3857',
};

const formatToSHJS = {
  'image/jpeg': 'MimeTypes.JPEG',
  'image/png': 'MimeTypes.PNG',
  //tiff supported?
  'image/tiff': 'MimeTypes.PNG',
};

const locationToSHJSLocation = {
  'aws-eu-central-1': 'awsEuCentral1',
  'aws-us-west-2': 'awsUsWest2',
};

const getSHJSImports = (reqState) => {
  const layer = datasourceToSHJSLayer[reqState.datasource];
  let imports = layer + `, setAuthToken, ApiType, MimeTypes, ${crsToSHJSCrs[reqState.CRS]}, BBox`;

  //If Byoc, location is needed
  if (reqState.datasource === 'CUSTOM') {
    imports += ', LocationIdSHv3';
  }

  //If datafusion, need to import other layers too.
  if (reqState.datasource === 'DATAFUSION') {
    imports += `, ${datasourceToSHJSLayer[reqState.datafusionSources[0].datasource]}, ${
      datasourceToSHJSLayer[reqState.datafusionSources[1].datasource]
    }`;
  }

  return imports;
};

// [[],[],[]] -> 'num,num,num,num'
export const generateSHBbox = (geometry, selectedCrs) => {
  if (!geometry) {
    return null;
  }
  let geo = geometry;
  if (selectedCrs !== 'EPSG:4326') {
    geo = transformGeometryToNewCrs(geometry, selectedCrs);
  }
  if (geo.length === 4) {
    const b = `${geo[0]}, ${geo[1]}, ${geo[2]}, ${geo[3]}`;
    return b;
  } else {
    const b = bbox(geo);
    return `${b[0]}, ${b[1]}, ${b[2]}, ${b[3]}`;
  }
};

const addDefaultOptionsS1IfNeeded = (dataFilterOptions) => {
  if (!dataFilterOptions.acquisitionMode || dataFilterOptions.acquisitionMode === 'DEFAULT') {
    dataFilterOptions.acquisitionMode = 'IW';
  }
  if (!dataFilterOptions.resolution || dataFilterOptions.resolution === 'DEFAULT') {
    dataFilterOptions.resolution = 'HIGH';
  }
  if (!dataFilterOptions.polarization || dataFilterOptions.polarization === 'DEFAULT') {
    dataFilterOptions.polarization = 'DV';
  }
};

const getSHJSOptions = (reqState, idx = 0) => {
  let shjsOptions = '';
  // Iterate through the different options and write non DEFAULT ones.
  const dataFilterOptions = reqState.dataFilterOptions[idx].options;
  const processingOptions = reqState.processingOptions[idx].options;
  // If S1, add default options since shjs always need the options
  if (reqState.datasource === S1GRD) {
    addDefaultOptionsS1IfNeeded(dataFilterOptions);
  }
  if (!isEmpty(dataFilterOptions)) {
    Object.keys(dataFilterOptions).forEach((key) => {
      if (dataFilterOptions[key] !== 'DEFAULT') {
        shjsOptions = shjsOptions + `\n  ${key}:'${dataFilterOptions[key]}',`;
      }
    });
  }
  if (!isEmpty(processingOptions)) {
    Object.keys(processingOptions).forEach((key) => {
      if (processingOptions[key] !== 'DEFAULT') {
        shjsOptions = shjsOptions + `\n  ${key}:'${processingOptions[key]}',`;
      }
    });
  }

  // If byoc, need to specify location + collectionId
  if (reqState.datasource === CUSTOM) {
    shjsOptions =
      shjsOptions +
      `\n  locationId: LocationIdSHv3.${locationToSHJSLocation[reqState.byocLocation]},\n  collectionId: '${
        reqState.byocCollectionId
      }'`;
  }
  return shjsOptions;
};

const getShJSLayers = (reqState) => {
  let stringLayer = '';

  //if datafusion need to create previous layers and layers array.
  if (reqState.datasource === 'DATAFUSION') {
    reqState.datafusionSources.forEach((source, idx) => {
      const datafusionLayer = datasourceToSHJSLayer[source.datasource];
      stringLayer =
        stringLayer +
        `const layer${idx} = new ${datafusionLayer}({
  evalscript: evalscript,\
  ${getSHJSOptions(reqState, idx)}
});\n`;
    });

    stringLayer =
      stringLayer +
      `
const layers = [
  {
    layer: layer0,
    id: '${reqState.datafusionSources[0].id}',
    timeFrom: new Date('${reqState.timeFrom[0]}'),
    timeTo: new Date('${reqState.timeTo[0]}')
  },
  {
    layer: layer1,
    id: '${reqState.datafusionSources[1].id}',
    timeFrom: new Date('${reqState.timeFrom[1] ? reqState.timeFrom[1] : reqState.timeFrom[0]}'),
    timeTo: new Date('${reqState.timeTo[1] ? reqState.timeTo[1] : reqState.timeTo[0]}')
  }
]
`;
    const layer = datasourceToSHJSLayer[reqState.datasource];
    stringLayer =
      stringLayer +
      `const layer = new ${layer}({
  evalscript: evalscript,
  layers: layers
});`;
  } else {
    const layer = datasourceToSHJSLayer[reqState.datasource];
    stringLayer =
      stringLayer +
      `const layer = new ${layer}({
  evalscript: evalscript,\
  ${getSHJSOptions(reqState)}
});`;
  }
  return stringLayer;
};

// If there's more than one date, return the earliest
const getTimeFromHelper = (requestState) => {
  if (requestState.timeFrom.length > 1) {
    let firstDate = requestState.timeFrom[0];
    let secondDate = requestState.timeFrom[1];
    if (new Date(firstDate) < new Date(secondDate)) {
      return firstDate;
    }
    return secondDate;
  }
  return requestState.timeFrom[0];
};

// If there's more than one date, return the latest
const getTimeToHelper = (requestState) => {
  if (requestState.timeTo.length > 1) {
    let firstDate = requestState.timeTo[0];
    let secondDate = requestState.timeTo[1];
    if (new Date(firstDate) > new Date(secondDate)) {
      return firstDate;
    }
    return secondDate;
  }
  return requestState.timeTo[0];
};

const generateGetMapParams = (requestState) => {
  return `const getMapParams = {
      bbox: new BBox(${crsToSHJSCrs[requestState.CRS]}, ${generateSHBbox(
    requestState.geometry,
    requestState.CRS,
  )}),
      fromTime: new Date('${getTimeFromHelper(requestState)}'),
      toTime: new Date('${getTimeToHelper(requestState)}'),
      width: ${requestState.width},
      height: ${requestState.height},
      format: ${formatToSHJS[requestState.responses[0].format]},\
      ${
        requestState.geometry.type === 'Polygon'
          ? `\n    geometry: ${JSON.stringify(
              transformGeometryToNewCrs(requestState.geometry, requestState.CRS),
            )}`
          : ''
      }
  }`;
};

export const getSHJSCode = (requestState, token) => {
  //Multiresponse not supported.
  if (requestState.responses.length > 1) {
    return '// Multi-part response is not supported. See curl mode';
  }
  const evalscript = requestState.evalscript;

  let shjsCode = `import { ${getSHJSImports(requestState)} } from '@sentinel-hub/sentinelhub-js';\n\n`;

  shjsCode += `${token ? `setAuthToken('${token}');\n\n` : ''}`;

  shjsCode += `const evalscript = \`${evalscript}\`;\n\n`;

  shjsCode += `${getShJSLayers(requestState)}\n\n`;

  shjsCode += generateGetMapParams(requestState);

  shjsCode += `\n\nlayer.getMap(getMapParams, ApiType.PROCESSING).then(response => {
        //
});`;

  return shjsCode;
};
