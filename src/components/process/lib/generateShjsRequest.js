import bbox from '@turf/bbox';
import { isEmpty } from '../../../utils/commonUtils';
import {
  S2L2A,
  S2L1C,
  LOTL1,
  LOTL2,
  S1GRD,
  S3OLCI,
  S3SLSTR,
  S5PL2,
  MODIS,
  DEM,
  CUSTOM,
  LTML1,
  LTML2,
} from '../../../utils/const/const';
import { isBbox, isPolygon } from '../../common/Map/utils/crsTransform';

const datasourceToSHJSLayer = {
  [S2L2A]: 'S2L2ALayer',
  [S2L1C]: 'S2L1CLayer',
  [LOTL1]: 'Landsat8AWSLOTL1Layer',
  [LOTL2]: 'Landsat8AWSLOTL2Layer',
  [LTML1]: 'Landsat45AWSLTML1Layer',
  [LTML2]: 'Landsat45AWSLTML2Layer',
  [S1GRD]: 'S1GRDAWSEULayer',
  [S3OLCI]: 'S3OLCILayer',
  [S3SLSTR]: 'S3SLSTRLayer',
  [S5PL2]: 'S5PL2Layer',
  [MODIS]: 'MODISLayer',
  [DEM]: 'DEMLayer',
  [CUSTOM]: 'BYOCLayer',
};

const crsToSHJSCrs = {
  'EPSG:4326': 'CRS_EPSG4326',
  'EPSG:3857': 'CRS_EPSG3857',
};

const getShjsCrs = (crs) => {
  const res = crsToSHJSCrs[crs];
  if (res === undefined) {
    return '<CRS-NOT-SUPPORTED>';
  }
  return res;
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

const getSHJSImports = (reqState, selectedCrs) => {
  const usedDataCol = reqState.dataCollections.length > 1 ? 'DATAFUSION' : reqState.dataCollections[0].type;
  const layer = datasourceToSHJSLayer[usedDataCol];
  let imports = layer + `, setAuthToken, ApiType, MimeTypes, ${getShjsCrs(selectedCrs)}, BBox`;

  //If Byoc, location is needed
  if (usedDataCol === CUSTOM) {
    imports += ', LocationIdSHv3';
  }

  //If datafusion, need to import other layers too.
  if (usedDataCol === 'DATAFUSION') {
    imports += `, ${datasourceToSHJSLayer[reqState.dataCollections[0].type]}, ${
      datasourceToSHJSLayer[reqState.dataCollections[1].type]
    }`;
  }

  return imports;
};

// [[],[],[]] -> 'num,num,num,num'
export const generateSHBbox = (convertedGeometry) => {
  if (!convertedGeometry) {
    return null;
  }
  if (isBbox(convertedGeometry)) {
    const b = `${convertedGeometry[0]}, ${convertedGeometry[1]}, ${convertedGeometry[2]}, ${convertedGeometry[3]}`;
    return b;
  } else {
    const b = bbox(convertedGeometry);
    return `${b[0]}, ${b[1]}, ${b[2]}, ${b[3]}`;
  }
};

const addDefaultOptionsS1IfNeeded = (dataFilterOptions) => {
  const dataFilterOptionsWithDefaults = Object.assign({}, dataFilterOptions);
  if (!dataFilterOptions.acquisitionMode || dataFilterOptions.acquisitionMode === 'DEFAULT') {
    dataFilterOptionsWithDefaults.acquisitionMode = 'IW';
  }
  if (!dataFilterOptions.resolution || dataFilterOptions.resolution === 'DEFAULT') {
    dataFilterOptionsWithDefaults.resolution = 'HIGH';
  }
  if (!dataFilterOptions.polarization || dataFilterOptions.polarization === 'DEFAULT') {
    dataFilterOptionsWithDefaults.polarization = 'DV';
  }
  return dataFilterOptionsWithDefaults;
};

const getSHJSOptions = (reqState, idx = 0) => {
  let shjsOptions = '';
  // Iterate through the different options and write non DEFAULT ones.
  const dataFilterOptions = reqState.dataFilterOptions[idx].options;
  const processingOptions = reqState.processingOptions[idx].options;
  const hasS1Layer = reqState.dataCollections.find((dc) => dc.type === S1GRD);
  const customLayer = reqState.dataCollections.find((dc) => dc.type === CUSTOM);
  // If S1, add default options since shjs always need the options
  let dataFilterOptionsWithDefaults = dataFilterOptions;
  if (hasS1Layer) {
    dataFilterOptionsWithDefaults = addDefaultOptionsS1IfNeeded(dataFilterOptions);
  }
  if (!isEmpty(dataFilterOptionsWithDefaults)) {
    Object.keys(dataFilterOptionsWithDefaults).forEach((key) => {
      if (dataFilterOptionsWithDefaults[key] !== 'DEFAULT') {
        shjsOptions = shjsOptions + `\n  ${key}:'${dataFilterOptionsWithDefaults[key]}',`;
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
  if (customLayer) {
    shjsOptions =
      shjsOptions +
      `\n  locationId: LocationIdSHv3.${
        locationToSHJSLocation[customLayer.byocCollectionLocation]
      },\n  collectionId: '${customLayer.byocCollectionId}'`;
  }
  return shjsOptions;
};

const getShJSLayers = (reqState) => {
  let stringLayer = '';
  const isOnDatafusion = reqState.dataCollections.length > 1;
  //if datafusion need to create previous layers and layers array.
  if (isOnDatafusion) {
    reqState.dataCollections.forEach((source, idx) => {
      const datafusionLayer = datasourceToSHJSLayer[source.type];
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
    id: '${reqState.dataCollections[0].id}',
    timeFrom: new Date('${reqState.timeFrom[0]}'),
    timeTo: new Date('${reqState.timeTo[0]}')
  },
  {
    layer: layer1,
    id: '${reqState.dataCollections[1].id}',
    timeFrom: new Date('${reqState.timeFrom[1] ? reqState.timeFrom[1] : reqState.timeFrom[0]}'),
    timeTo: new Date('${reqState.timeTo[1] ? reqState.timeTo[1] : reqState.timeTo[0]}')
  }
]
`;
    stringLayer =
      stringLayer +
      `const layer = new ProcessingDataFusionLayer({
  evalscript: evalscript,
  layers: layers
});`;
  } else {
    const layer = datasourceToSHJSLayer[reqState.dataCollections[0].type];
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

const generateGetMapParams = (requestState, mapState) => {
  return `const getMapParams = {
      bbox: new BBox(${crsToSHJSCrs[mapState.selectedCrs]}, ${generateSHBbox(mapState.convertedGeometry)}),
      fromTime: new Date('${getTimeFromHelper(requestState)}'),
      toTime: new Date('${getTimeToHelper(requestState)}'),
      width: ${requestState.width},
      height: ${requestState.height},
      format: ${formatToSHJS[requestState.responses[0]?.format]},\
      ${
        isPolygon(mapState.convertedGeometry)
          ? `\n      geometry: ${JSON.stringify(mapState.convertedGeometry)}`
          : ''
      }
  }`;
};

export const getSHJSCode = (requestState, mapState, token) => {
  //Multiresponse not supported.
  if (requestState.responses.length > 1) {
    return '// Multi-part response is not supported. See curl mode';
  }
  const evalscript = requestState.evalscript;

  let shjsCode = `import { ${getSHJSImports(
    requestState,
    mapState.selectedCrs,
  )} } from '@sentinel-hub/sentinelhub-js';\n\n`;

  shjsCode += `${token ? `setAuthToken('${token}');\n\n` : ''}`;

  shjsCode += `const evalscript = \`${evalscript}\`;\n\n`;

  shjsCode += `${getShJSLayers(requestState)}\n\n`;

  shjsCode += generateGetMapParams(requestState, mapState);

  shjsCode += `\n\nlayer.getMap(getMapParams, ApiType.PROCESSING).then(response => {
        //
});`;

  return shjsCode;
};
