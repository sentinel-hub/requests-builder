import { getBaseUrl, isOnDefaultUrl } from '../../api/url';
import { S2L2A, S2L1C, S1GRD, S5PL2, S3SLSTR, S3OLCI } from '../../utils/const/const';

export const S2L1C_CATALOG_ID = 'sentinel-2-l1c';
export const S2L2A_CATALOG_ID = 'sentinel-2-l2a';
export const S1GRD_CATALOG_ID = 'sentinel-1-grd';
export const LANDSAT_8_1_CATALOG_ID = 'landsat-ot-l1';
export const LANDSAT_8_2_CATALOG_ID = 'landsat-ot-l2';
export const LANDSAT_7_1_CATALOG_ID = 'landsat-etm-l1';
export const LANDSAT_7_2_CATALOG_ID = 'landsat-etm-l2';
export const LANDSAT_TM_2_CATALOG_ID = 'landsat-tm-l2';
export const LANDSAT_TM_1_CATALOG_ID = 'landsat-tm-l1';
export const LANDSAT_MSS_1_CATALOG_ID = 'landsat-mss-l1';
export const S5PL2_CATALOG_ID = 'sentinel-5p-l2';
export const S3SLSTR_CATALOG_ID = 'sentinel-3-slstr';
export const S3OLCI_CATALOG_ID = 'sentinel-3-olci';

export const S1OPTIONS = [
  {
    propertyName: 'sar:instrument_mode',
    possibleValues: ['SM', 'IW', 'EW', 'WV'],
    operators: ['eq'],
  },
  {
    propertyName: 'sat:orbit_state',
    possibleValues: ['ASCENDING', 'DESCENDING'],
    operators: ['eq'],
  },
  {
    propertyName: 'resolution',
    possibleValues: ['HIGH', 'MEDIUM'],
    operators: ['eq'],
  },
  {
    propertyName: 'polarization',
    possibleValues: ['SH', 'SV', 'DH', 'DV', 'HH', 'HV', 'VV', 'VH'],
    operators: ['eq'],
  },
  {
    propertyName: 'timeliness',
    possibleValues: ['NRT10m', 'NRT1h', 'NRT3h', 'Fast24h', 'Offline', 'Reprocessing', 'ArchNormal'],
    operators: ['eq'],
  },
];

export const S5Options = [
  {
    propertyName: 'type',
    operators: ['eq'],
    possibleValues: [
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
    ],
  },
  {
    propertyName: 'timeliness',
    operators: ['eq'],
    possibleValues: ['NRTI', 'OFFL', 'RPRO'],
  },
];

export const CatalogCloudOptions = [
  {
    propertyName: 'eo:cloud_cover',
    operators: ['eq', 'lt', 'gt', 'gte', 'lte'],
    possibleValues: 'Numbers',
  },
];

export const S3SLSTR_CATALOG_OPTIONS = [
  ...CatalogCloudOptions,
  {
    propertyName: 'eo:gsd',
    operators: ['eq', 'lt', 'gt', 'gte', 'lte'],
    possibleValues: 'Numbers',
  },
];

export const datasourceToCollection = {
  [S2L2A]: S2L2A_CATALOG_ID,
  [S2L1C]: S2L1C_CATALOG_ID,
  [S1GRD]: S1GRD_CATALOG_ID,
  [S5PL2]: S5PL2_CATALOG_ID,
  [S3SLSTR]: S3SLSTR_CATALOG_ID,
  [S3OLCI]: S3OLCI_CATALOG_ID,
};

export const collectionToOptions = {
  [S2L1C_CATALOG_ID]: CatalogCloudOptions,
  [S2L2A_CATALOG_ID]: CatalogCloudOptions,
  [S1GRD_CATALOG_ID]: S1OPTIONS,
  [LANDSAT_8_1_CATALOG_ID]: CatalogCloudOptions,
  [LANDSAT_8_2_CATALOG_ID]: CatalogCloudOptions,
  [LANDSAT_7_1_CATALOG_ID]: CatalogCloudOptions,
  [LANDSAT_7_2_CATALOG_ID]: CatalogCloudOptions,
  [LANDSAT_TM_1_CATALOG_ID]: CatalogCloudOptions,
  [LANDSAT_TM_2_CATALOG_ID]: CatalogCloudOptions,
  [LANDSAT_MSS_1_CATALOG_ID]: CatalogCloudOptions,
  [S5PL2_CATALOG_ID]: S5Options,
  [S3SLSTR_CATALOG_ID]: S3SLSTR_CATALOG_OPTIONS,
};

export const CATALOG_BASE_URL = () =>
  isOnDefaultUrl() ? 'https://services.sentinel-hub.com/api/v1/catalog/' : `${getBaseUrl()}/api/v1/catalog/`;
export const CATALOG_CREO_URL = 'https://creodias.sentinel-hub.com/api/v1/catalog/';
export const CATALOG_WEST_URL = 'https://services-uswest2.sentinel-hub.com/api/v1/catalog/';

export const getCatalogOptions = () => [
  { url: CATALOG_BASE_URL(), name: 'EU' },
  { url: CATALOG_CREO_URL, name: 'CREO' },
  { url: CATALOG_WEST_URL, name: 'US-WEST' },
];

export const collectionIdToUrl = (dataCollection) => {
  switch (dataCollection) {
    case S2L1C_CATALOG_ID:
      return CATALOG_BASE_URL();
    case S2L2A_CATALOG_ID:
      return CATALOG_BASE_URL();
    case S1GRD_CATALOG_ID:
      return CATALOG_BASE_URL();
    case LANDSAT_8_1_CATALOG_ID:
    case LANDSAT_8_2_CATALOG_ID:
      return CATALOG_WEST_URL;
    case S5PL2_CATALOG_ID:
      return CATALOG_WEST_URL;
    case S3OLCI_CATALOG_ID:
      return CATALOG_CREO_URL;
    case S3SLSTR_CATALOG_ID:
      return CATALOG_CREO_URL;
    default:
      CATALOG_BASE_URL();
  }
};
