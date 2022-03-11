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
  LETML1,
  LMSSL1,
  LETML2,
  EU_CENTRAL_DEPLOYMENT,
  CREODIAS_DEPLOYMENT,
  US_WEST_DEPLOYMENT,
} from '../../../utils/const/const';
import { generateSHBbox } from './generateShjsRequest';
import { isBbox, isPolygon } from '../../common/Map/utils/geoUtils';
import { isEmpty } from '../../../utils/commonUtils';

const formatToSHPY = {
  'image/jpeg': 'MimeType.JPG',
  'image/png': 'MimeType.PNG',
  'image/tiff': 'MimeType.TIFF',
};

const getSHPYImports = () => {
  return `from sentinelhub import SentinelHubRequest, DataCollection, \
MimeType, CRS, BBox, SHConfig, Geometry\n`;
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

export const datasourceToSHPYDatasource = (dataCollection, requestState) => {
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
      return 'DataCollection.LANDSAT_OT_L1';
    case LOTL2:
      return 'DataCollection.LANDSAT_OT_L2';
    case LTML1:
      return 'DataCollection.LANDSAT_TM_L1';
    case LTML2:
      return 'DataCollection.LANDSAT_TM_L2';
    case S5PL2:
      return 'DataCollection.SENTINEL5P';
    case CUSTOM:
      return `DataCollection.define_byoc('${dataCollection.byocCollectionId}')`;
    case LETML1:
      return 'DataCollection.LANDSAT_ETM_L1';
    case LETML2:
      return 'DataCollection.LANDSAT_ETM_L2';
    case LMSSL1:
      return 'DataCollection.LANDSAT_MSS_L1';
    default:
      return '';
  }
};

export const getDimensionsSHPY = (requestState) => {
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

export const versionComment = `# This is script may only work with sentinelhub.__version__ >= '3.4.0'\n`;

// optional argument
export const getSHPYCredentials = (dataCollections) => {
  const deploymentToConfigInstanceId = (deployment) => {
    switch (deployment) {
      case CREODIAS_DEPLOYMENT:
        return '\nconfig.instance_id = "creodias.sentinel-hub.com/api/"';
      case US_WEST_DEPLOYMENT:
        return '\nconfig.instance_id = "services-uswest2.sentinel-hub.com/api/"';
      default:
        return '';
    }
  };

  let config = `\n# Credentials
config = SHConfig()
config.sh_client_id = '<your client id here>'
config.sh_client_secret = '<your client secret here>'`;
  if (
    dataCollections &&
    dataCollections[0].type === CUSTOM &&
    dataCollections[0].byocCollectionLocation !== EU_CENTRAL_DEPLOYMENT
  ) {
    config += deploymentToConfigInstanceId(dataCollections[0].byocCollectionLocation);
  }
  return config;
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
  const { dataCollections } = reqState;
  const isOnDatafusion = dataCollections.length > 1;
  return dataCollections.reduce((acc, dataCollection, idx) => {
    const advancedOptions = getSHPYAdvancedOptions(reqState, idx);
    acc += `${idx > 0 ? '\n       ' : ''}SentinelHubRequest.input_data(
            data_collection=${datasourceToSHPYDatasource(dataCollection, reqState)},\
          ${isOnDatafusion ? `\n            identifier=${dataCollection.id},` : ''}
            ${getSHPYTimerange(reqState, idx)}\
          ${advancedOptions ? `\n            ${advancedOptions}` : ''}
        ),`;
    return acc;
  }, '');
};

const getSHPYTimerange = (reqState, idx = 0) => {
  if (reqState.isTimeRangeDisabled) {
    return '';
  }
  let timeFrom = reqState.timeFrom[idx] ? reqState.timeFrom[idx] : reqState.timeFrom[0];
  let timeTo = reqState.timeTo[idx] ? reqState.timeTo[idx] : reqState.timeTo[0];
  return `time_interval=('${timeFrom.split('T')[0]}', '${timeTo.split('T')[0]}'),`;
};

export const getSHPYAdvancedOptions = (reqState, idx = 0) => {
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

  let resultString = !isEmpty(resultObject)
    ? `other_args=${JSON.stringify(resultObject).replaceAll('":', '": ')}`
    : '';

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
  let shpyCode = versionComment;
  shpyCode += `${getSHPYImports()}`;
  //Credentials
  shpyCode += getSHPYCredentials(requestState.dataCollections);
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
        ${getSHPYResponses(requestState)}\
],
    bbox=bbox,\
${isPolygon(mapState.convertedGeometry) ? '\n    geometry=geometry,' : ''}
    ${getDimensionsSHPY(requestState)}
    config=config
)`;

  shpyCode += `\n\nresponse = request.get_data()\n`;

  // Replace booleans on js for booleans on Py.
  return shpyCode.replace(/true|false/, (matched) => booleanToPyBoolean[matched]);
};
