import {
  DEM,
  LETML1,
  LETML2,
  LMSSL1,
  LOTL1,
  LOTL2,
  LTML1,
  LTML2,
  MODIS,
  S1GRD,
  S2L1C,
  S2L2A,
  S3OLCI,
  S3SLSTR,
  S5PL2,
} from '../../../../utils/const/const';

export const SETUP_DOCS = 'https://docs.sentinel-hub.com/api/latest/evalscript/v3/#setup-function';
export const INPUT_DOCS = 'https://docs.sentinel-hub.com/api/latest/evalscript/v3/#input-object-properties';
export const OUTPUT_DOCS = 'https://docs.sentinel-hub.com/api/latest/evalscript/v3/#output-object-properties';
export const MOSAICKING_DOCS = 'https://docs.sentinel-hub.com/api/latest/evalscript/v3/#mosaicking';
export const EVALUATE_PIXEL_DOCS =
  'https://docs.sentinel-hub.com/api/latest/evalscript/v3/#evaluatepixel-function';
export const ADDITIONAL_FUNCS_DOCS =
  'https://docs.sentinel-hub.com/api/latest/evalscript/v3/#updateoutputmetadata-function-optional';

const S1_BANDS = ['VV', 'VH', 'HV', 'HH', 'localIncidenceAngle', 'scatteringArea', 'shadowMask', 'dataMask'];
const S2L1C_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06',
  'B07',
  'B08',
  'B8A',
  'B09',
  'B10',
  'B11',
  'B12',
  'CLP',
  'CLM',
  'sunAzimuthAngles',
  'sunZenithAngles',
  'viewAzimuthMean',
  'viewZenithMean',
  'dataMask',
];
const S2L2A_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06',
  'B07',
  'B08',
  'B8A',
  'B09',
  'B11',
  'B12',
  'AOT',
  'SCL',
  'SNW',
  'CLD',
  'CLP',
  'CLM',
  'sunAzimuthAngles',
  'sunZenithAngles',
  'viewAzimuthMean',
  'viewZenithMean',
  'dataMask',
];
const S3_OCLI_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06',
  'B07',
  'B08',
  'B09',
  'B10',
  'B11',
  'B12',
  'B13',
  'B14',
  'B15',
  'B16',
  'B17',
  'B18',
  'B19',
  'B20',
  'B21',
  'dataMask',
];
const S3_SLSTR_BANDS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'F1', 'F2', 'dataMask'];
const S5_BANDS = [
  'CO',
  'HCHO',
  'NO2',
  'O3',
  'SO2',
  'CH4',
  'AER_AI_340_380',
  'AER_AI_354_388',
  'CLOUD_BASE_PRESSURE',
  'CLOUD_TOP_PRESSURE',
  'CLOUD_BASE_HEIGHT',
  'CLOUD_TOP_HEIGHT',
  'CLOUD_OPTICAL_THICKNESS',
  'CLOUD_FRACTION',
  'dataMask',
];
const LOTL1_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06',
  'B07',
  'B08',
  'B09',
  'B10',
  'B11',
  'BQA',
  'QA_RADSAT',
  'VAA',
  'VZA',
  'SAA',
  'SZA',
  'dataMask',
];
const LOTL2_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06',
  'B07',
  'B10',
  'BQA',
  'QA_RADSAT',
  'SR_QA_AEROSOL',
  'ST_QA',
  'ST_TRAD',
  'ST_URAD',
  'ST_DRAD',
  'ST_ATRAN',
  'ST_EMIS',
  'ST_EMSD',
  'ST_CDIST',
  'dataMask',
];
const LETML1_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06_VCID_1, B06_VCID_2',
  'B07',
  'B08',
  'QA_RADSAT',
  'VAA',
  'VZA',
  'SAA',
  'SZA',
  'dataMask',
];
const LETML2_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06',
  'B07',
  'QA_RADSAT',
  'ST_TRAD',
  'ST_URAD',
  'ST_DRAD',
  'ST_ATRAN',
  'ST_EMIS',
  'ST_EMSD',
  'ST_CDIST',
  'SR_ATMOS_OPACITY',
  'SR_CLOUD_QA',
  'ST_QA',
  'dataMask',
];
const LTML1_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06',
  'B07',
  'BQA',
  'QA_RADSAT',
  'VAA',
  'VZA',
  'SAA',
  'SZA',
  'dataMask',
];
const LTML2_BANDS = [
  'B01',
  'B02',
  'B03',
  'B04',
  'B05',
  'B06',
  'B07',
  'BQA',
  'QA_RADSAT',
  'ST_TRAD',
  'ST_URAD',
  'ST_DRAD',
  'ST_ATRAN',
  'ST_EMIS',
  'ST_EMSD',
  'ST_CDIST',
  'SR_ATMOS_OPACITY',
  'SR_CLOUD_QA',
  'ST_QA',
  'dataMask',
];
const LMSSL1_BANDS = ['B01', 'B02', 'B03', 'B04', 'QA_RADSAT', 'VAA', 'VZA', 'SAA', 'SZA', 'dataMask'];
const MODIS_BANDS = ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'dataMask'];
const DEM_BANDS = ['DEM', 'dataMask'];

export const dataCollectionToBands = (datasource) => {
  switch (datasource) {
    case S2L1C:
      return S2L1C_BANDS;
    case S2L2A:
      return S2L2A_BANDS;
    case LOTL1:
      return LOTL1_BANDS;
    case LOTL2:
      return LOTL2_BANDS;
    case LTML1:
      return LTML1_BANDS;
    case LTML2:
      return LTML2_BANDS;
    case LETML1:
      return LETML1_BANDS;
    case LETML2:
      return LETML2_BANDS;
    case LMSSL1:
      return LMSSL1_BANDS;
    case MODIS:
      return MODIS_BANDS;
    case DEM:
      return DEM_BANDS;
    case S1GRD:
      return S1_BANDS;
    case S3OLCI:
      return S3_OCLI_BANDS;
    case S3SLSTR:
      return S3_SLSTR_BANDS;
    case S5PL2:
      return S5_BANDS;
    default:
      return [];
  }
};
