import { S2L2A, S2L1C, S1GRD, S5PL2, S3SLSTR, S3OLCI } from '../../utils/const/const';

export const S2L1C_CATALOG_ID = 'sentinel-2-l1c';
export const S2L2A_CATALOG_ID = 'sentinel-2-l2a';
export const S1GRD_CATALOG_ID = 'sentinel-1-grd';
export const LANDSAT_8_CATALOG_ID = 'landsat-8-l1c';
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
  [LANDSAT_8_CATALOG_ID]: CatalogCloudOptions,
  [S5PL2_CATALOG_ID]: S5Options,
  [S3SLSTR_CATALOG_ID]: S3SLSTR_CATALOG_OPTIONS,
};

export const CATALOG_BASE_URL = 'https://services.sentinel-hub.com/api/v1/catalog/';
export const CATALOG_CREO_URL = 'https://creodias.sentinel-hub.com/api/v1/catalog/';
export const CATALOG_WEST_URL = 'https://services-uswest2.sentinel-hub.com/api/v1/catalog/';

export const CATALOG_OPTIONS = [
  { url: CATALOG_BASE_URL, name: 'EU' },
  { url: CATALOG_CREO_URL, name: 'CREO' },
  { url: CATALOG_WEST_URL, name: 'US-WEST' },
];

export const collectionIdToUrl = {
  [S2L1C_CATALOG_ID]: CATALOG_BASE_URL,
  [S2L2A_CATALOG_ID]: CATALOG_BASE_URL,
  [S1GRD_CATALOG_ID]: CATALOG_BASE_URL,
  [LANDSAT_8_CATALOG_ID]: CATALOG_WEST_URL,
  [S5PL2_CATALOG_ID]: CATALOG_WEST_URL,
  [S3OLCI_CATALOG_ID]: CATALOG_CREO_URL,
  [S3SLSTR_CATALOG_ID]: CATALOG_CREO_URL,
};
