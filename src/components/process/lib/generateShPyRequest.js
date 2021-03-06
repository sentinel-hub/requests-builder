import {
  S1GRD,
  S2L1C,
  S2L2A,
  S3OLCI,
  S3SLSTR,
  S5PL2,
  MODIS,
  DEM,
  LOTL1,
  LOTL2,
  CUSTOM,
  LTML1,
  LTML2,
} from '../../../utils/const/const';
import { generateSHBbox } from './generateShjsRequest';
import { isBbox, isPolygon } from '../../common/Map/utils/crsTransform';
import { isEmpty } from '../../../utils/commonUtils';

const formatToSHPY = {
  // JPEG not supported on shpy
  'image/jpeg': 'MimeType.PNG',
  'image/png': 'MimeType.PNG',
  'image/tiff': 'MimeType.TIFF',
};

const getSHPYImports = () => {
  return `import matplotlib.pyplot as plt \n
from sentinelhub import SentinelHubRequest, SentinelHubDownloadClient, DataCollection, \
MimeType, DownloadRequest, CRS, BBox, SHConfig, Geometry\n`;
};

const getSHPYS1Datasource = (reqState) => {
  const isDefault = (option) => {
    return Boolean(!option || option === 'DEFAULT');
  };

  //Sh-py options.
  let possibleOptions = [
    'SENTINEL1_EW',
    'SENTINEL1_EW_ASC',
    'SENTINEL1_EW_DES',
    'SENTINEL1_EW_SH',
    'SENTINEL1_EW_SH_ASC',
    'SENTINEL1_EW_SH_DES',
    'SENTINEL1_IW',
    'SENTINEL1_IW_ASC',
    'SENTINEL1_IW_DES',
  ];

  const dataFilterOptions = reqState.dataFilterOptions[0].options;
  const { acquisitionMode, polarization, orbitDirection } = dataFilterOptions;
  // Default
  if (isDefault(acquisitionMode) && isDefault(polarization) && isDefault(orbitDirection)) {
    return 'SENTINEL1_IW';
  }
  if (orbitDirection === 'ASCENDING' || isDefault(orbitDirection)) {
    possibleOptions = possibleOptions.filter((opt) => opt.includes('ASC'));
  }
  if (orbitDirection === 'DESCENDING') {
    possibleOptions = possibleOptions.filter((opt) => opt.includes('DES'));
  }
  if (acquisitionMode === 'IW' || isDefault(acquisitionMode)) {
    possibleOptions = possibleOptions.filter((opt) => opt.includes('IW'));
  }
  if (acquisitionMode === 'EW') {
    possibleOptions = possibleOptions.filter((opt) => opt.includes('EW'));
  }
  if (polarization === 'SH') {
    possibleOptions = possibleOptions.filter((opt) => opt.includes('SH'));
  }
  return possibleOptions.length > 0 ? possibleOptions[0] : 'SENTINEL1_IW';
};

const datasourceToSHPYDatasource = (dataCollection, requestState) => {
  const { type } = dataCollection;
  switch (type) {
    case S1GRD:
      return `DataCollection.${getSHPYS1Datasource(requestState)}`;
    case S2L2A:
      return 'DataCollection.SENTINEL2_L2A';
    case S2L1C:
      return 'DataCollection.SENTINEL2_L1C';
    case S3OLCI:
      return 'DataCollection.SENTINEL3_OLCI';
    case S3SLSTR:
      return 'DataCollection.SENTINEL3_SLSTR';
    case MODIS:
      return 'DataCollection.MODIS';
    case DEM:
      return 'DataCollection.DEM';
    case LOTL1:
      return 'DataCollection.LANDSAT8_L1';
    case LOTL2:
      return 'DataCollection.LANDSAT8_L2';
    case LTML1:
      return 'DataCollection.LANDSAT45_L1';
    case LTML2:
      return 'DataCollection.LANDSAT45_L2';
    case S5PL2:
      return 'DataCollection.SENTINEL5P';
    case CUSTOM:
      return `DataCollection.define_byoc('${dataCollection.byocCollectionId}')`;
    default:
      return '';
  }
};

const getDimensionsSHPY = (requestState) => {
  if (requestState.heightOrRes === 'HEIGHT' || requestState.isOnAutoRes === true) {
    return `size=[${requestState.width}, ${requestState.height}],`;
  } else {
    return `resolution=(${requestState.width}, ${requestState.height}),`;
  }
};

const utmCrsToPyCrs = (crs) => {
  const isInvalidCode = (code) => {
    return !code || code?.length !== 5 || !(code[2] === '6' || code[2] === '7');
  };
  const code = crs.split(':')[1];
  if (isInvalidCode(code)) {
    return '<CRS NOT FOUND>';
  }
  const direction = code[2] === '6' ? 'N' : 'S';
  const zone = code.slice(3);
  return `UTM_${zone}${direction}`;
};

const crsToSHPYCrs = (crs) => {
  if (crs === 'EPSG:4326') {
    return 'CRS.WGS84';
  }
  if (crs === 'EPSG:3857') {
    return 'CRS.POP_WEB';
  }
  return utmCrsToPyCrs(crs);
};

export const getSHPYCredentials = () => {
  return `
#Credentials

CLIENT_ID = '<your client id here>'
CLIENT_SECRET = '<your client secret here>'
config = SHConfig()

if CLIENT_ID and CLIENT_SECRET:
  config.sh_client_id = CLIENT_ID
  config.sh_client_secret = CLIENT_SECRET
else:
  config = None
`;
};

export const getSHPYBounds = (mapState, oneOrTheOther = false) => {
  let boundsString = '';
  const bbox = generateSHBbox(mapState.convertedGeometry);

  boundsString += `bbox = BBox(bbox=[${bbox}], crs=${crsToSHPYCrs(mapState.selectedCrs)})\n`;

  if (isBbox(mapState.convertedGeometry) && oneOrTheOther) {
    return boundsString;
  }

  if (isPolygon(mapState.convertedGeometry)) {
    const geoString = `geometry = Geometry(geometry=${JSON.stringify(
      mapState.convertedGeometry,
    )}, crs=${crsToSHPYCrs(mapState.selectedCrs)})\n`;
    if (oneOrTheOther) {
      return geoString;
    }
    boundsString += geoString;
  }
  return boundsString;
};

const generateSHPYInputs = (reqState) => {
  // Datafusion
  const isOnDatafusion = reqState.dataCollections.length > 1;
  if (isOnDatafusion) {
    let datafusionString = '';
    reqState.dataCollections.forEach((source, idx) => {
      datafusionString += `SentinelHubRequest.input_data(
      data_collection=${datasourceToSHPYDatasource(source, reqState)},
      ${getSHPYTimerange(reqState, idx)}\
        ${getSHPYAdvancedOptions(reqState, idx)}
    ),\n    `;
    });
    return datafusionString;
  }

  // No datafusion
  return `SentinelHubRequest.input_data(
    data_collection=${datasourceToSHPYDatasource(reqState.dataCollections[0], reqState)},
    ${getSHPYTimerange(reqState)}\
    ${getSHPYAdvancedOptions(reqState)}
)`;
};

const getSHPYTimerange = (reqState, idx = 0) => {
  if (reqState.isTimeRangeDisabled) {
    return '';
  }
  let timeFrom = reqState.timeFrom[idx] ? reqState.timeFrom[idx] : reqState.timeFrom[0];
  let timeTo = reqState.timeTo[idx] ? reqState.timeTo[idx] : reqState.timeTo[0];
  return `time_interval=('${timeFrom.split('T')[0]}', '${timeTo.split('T')[0]}'),`;
};

const getSHPYAdvancedOptions = (reqState, idx = 0) => {
  const initialDataFilterOptions = reqState.dataFilterOptions[idx].options;
  const initialProcessingOptions = reqState.processingOptions[idx].options;
  const dataFilterOptions = {};
  const processing = {};
  const dataColType = reqState.dataCollections[idx].type;
  // Iterate through the options and add non default to datafilterOptions/processing
  if (!isEmpty(initialDataFilterOptions)) {
    Object.keys(initialDataFilterOptions).forEach((key) => {
      let value = initialDataFilterOptions[key];
      if (value !== 'DEFAULT' && key !== 'collectionId') {
        dataFilterOptions[key] = value;
      }
    });
  }

  if (!isEmpty(initialProcessingOptions)) {
    Object.keys(initialProcessingOptions).forEach((key) => {
      let value = initialProcessingOptions[key];
      if (value !== 'DEFAULT') {
        processing[key] = value;
      }
    });
  }

  //If S1, delete acqMode, polarization and orbitDir since they're specified via Datasource.
  if (dataColType === S1GRD) {
    delete dataFilterOptions['acquisitionMode'];
    delete dataFilterOptions['polarization'];
    delete dataFilterOptions['orbitDirection'];
  }

  const dataFilterIsEmpty = isEmpty(dataFilterOptions);
  const processingIsEmpty = isEmpty(processing);

  let resultObject = {};
  if (!dataFilterIsEmpty) {
    resultObject.dataFilter = dataFilterOptions;
  }
  if (!processingIsEmpty) {
    resultObject.processing = processing;
  }

  // If datafusion, add location, and id to other args.
  if (dataColType === 'DATAFUSION') {
    resultObject.id = reqState.dataCollections[idx].id;
  }

  let resultString = !isEmpty(resultObject) ? `\n      other_args = ${JSON.stringify(resultObject)}` : '';

  return resultString;
};

const getSHPYResponses = (reqState) => {
  let responsesString = '';
  reqState.responses.forEach((resp) => {
    responsesString =
      responsesString +
      `SentinelHubRequest.output_response('${resp.identifier}', ${formatToSHPY[resp.format]}),\n    `;
  });
  return responsesString;
};

const booleanToPyBoolean = {
  true: 'True',
  false: 'False',
};

export const getSHPYCode = (requestState, mapState) => {
  //add imports
  let shpyCode = `${getSHPYImports()}`;
  //Credentials
  shpyCode += getSHPYCredentials();
  // add evalscript
  shpyCode += `\nevalscript = """\n${requestState.evalscript}\n"""\n`;
  //add geometry/bounds
  shpyCode += getSHPYBounds(mapState);

  shpyCode += `\nrequest = SentinelHubRequest(
  evalscript=evalscript,
  input_data=[
    ${generateSHPYInputs(requestState)}
  ],
  responses=[
    ${getSHPYResponses(requestState)}
  ],
  bbox=bbox,\
  ${isPolygon(mapState.convertedGeometry) === 'Polygon' ? '\n  geometry=geometry,' : ''}
  ${getDimensionsSHPY(requestState)}
  config=config
)`;

  shpyCode += `\nresponse = request.get_data() `;

  // Replace booleans on js for booleans on Py.
  return shpyCode.replace(/true|false/, (matched) => booleanToPyBoolean[matched]);
};
