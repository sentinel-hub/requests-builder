import {
  DEFAULT_LANDSAT_EVALSCRIPT,
  DEFAULT_MODIS_EVALSCRIPT,
  DEFAULT_S2_EVALSCRIPT,
  DEFAULT_DEM_EVALSCRIPT,
  DEFAULT_BYOC_EVALSCRIPT,
  DEFAULT_DATAFUSION_EVALSCRIPT,
  DEFAULT_S1_EVALSCRIPT,
  DEFAULT_S3OLCI_EVALSCRIPT,
  DEFAULT_S3SLSTR_EVALSCRIPT,
  DEFAULT_S5PL2_EVALSCRIPT,
  DEFAULT_STATISTICAL_LANDSAT_EVALSCRIPT,
  DEFAULT_STATISTICAL_MODIS_EVALSCRIPT,
  DEFAULT_STATISTICAL_DEM_EVALSCRIPT,
  DEFAULT_STATISTICAL_S1_EVALSCRIPT,
  DEFAULT_STATISTICAL_S3OLCI_EVALSCRIPT,
  DEFAULT_STATISTICAL_S3SLSTR_EVALSCRIPT,
  DEFAULT_STATISTICAL_S2_EVALSCRIPT,
  DEFAULT_STATISTICAL_S5PL2_EVALSCRIPT,
} from './constEvalscript';

export const S2L1C = 'S2L1C';
export const S2L2A = 'S2L2A';
export const L8L1C = 'L8L1C';
export const LOTL1 = 'LOTL1';
export const LOTL2 = 'LOTL2';
export const MODIS = 'MODIS';
export const DEM = 'DEM';
export const S1GRD = 'S1GRD';
export const S3OLCI = 'S3OLCI';
export const S3SLSTR = 'S3SLSTR';
export const S5PL2 = 'S5PL2';
export const CUSTOM = 'CUSTOM';
export const DATAFUSION = 'DATAFUSION';

export const NEW_S2L1C = 'sentinel-2-l1c';
export const NEW_S2L2A = 'sentinel-2-l2a';
export const NEW_L8L1C = 'landsat-8-l1c';
export const NEW_LOTL1 = 'landsat-ot-l1';
export const NEW_LOTL2 = 'landsat-ot-l2';
export const NEW_MODIS = 'modis';
export const NEW_DEM = 'dem';
export const NEW_S1GRD = 'sentinel-1-grd';
export const NEW_S3OLCI = 'sentinel-3-olci';
export const NEW_S3SLSTR = 'sentinel-3-slstr';
export const NEW_S5PL2 = 'sentinel-5p-l2';
export const NEW_CUSTOM = 'custom';
export const NEW_DATAFUSION = 'DATAFUSION';

export const NEW_DATASOURCES_TO_OLD_MAP = {
  [NEW_S2L1C]: S2L1C,
  [NEW_S2L2A]: S2L2A,
  [NEW_L8L1C]: L8L1C,
  [NEW_LOTL1]: LOTL1,
  [NEW_LOTL2]: LOTL2,
  [NEW_MODIS]: MODIS,
  [NEW_DEM]: DEM,
  [NEW_S1GRD]: S1GRD,
  [NEW_S3OLCI]: S3OLCI,
  [NEW_S3SLSTR]: S3SLSTR,
  [NEW_S5PL2]: S5PL2,
  [NEW_CUSTOM]: CUSTOM,
};

export const DATASOURCES = {
  [S2L1C]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l1c',
    isBatchSupported: true,
    isStatApiSupported: true,
  },
  [S2L2A]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l2a',
    isBatchSupported: true,
    isStatApiSupported: true,
  },
  [L8L1C]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l8l1c',
    isBatchSupported: false,
    isStatApiSupported: true,
  },
  [LOTL1]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'lotl1',
    isBatchSupported: false,
    isStatApiSupported: true,
  },
  [LOTL2]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'lotl2',
    isBatchSupported: false,
    isStatApiSupported: true,
  },
  [MODIS]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'modis',
    isBatchSupported: false,
    isStatApiSupported: true,
  },
  [DEM]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'dem',
    isBatchSupported: true,
    isStatApiSupported: false,
  },
  [S1GRD]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 's1',
    isBatchSupported: true,
    isStatApiSupported: true,
  },
  [S3OLCI]: {
    url: 'https://creodias.sentinel-hub.com/api/v1',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'olci',
    isBatchSupported: false,
    isStatApiSupported: false,
  },
  [S3SLSTR]: {
    url: 'https://creodias.sentinel-hub.com/api/v1',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'slstr',
    isBatchSupported: false,
    isStatApiSupported: false,
  },
  [S5PL2]: {
    url: 'https://creodias.sentinel-hub.com/api/v1',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 's5pl2',
    isBatchSupported: false,
    isStatApiSupported: false,
  },
  [CUSTOM]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    selectName: 'Bring your own COG',
    isBatchSupported: true,
  },
  [DATAFUSION]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    isBatchSupported: true,
  },
};

export const DATASOURCES_NAMES = Object.keys(DATASOURCES);

export const OUTPUT_FORMATS = [
  {
    name: 'TIFF',
    value: 'image/tiff',
  },
  {
    name: 'PNG',
    value: 'image/png',
  },
  {
    name: 'JPEG',
    value: 'image/jpeg',
  },
  {
    name: 'APP/JSON',
    value: 'application/json',
  },
];

const isProcessLikeMode = (mode) => mode === 'PROCESS' || mode === 'BATCH';

export const getDefaultEvalscript = (mode, datasource) => {
  if (isProcessLikeMode(mode)) {
    return getProcessDefaultEvalscript(datasource);
  }
  return getStatisticalDefaultEvalscript(datasource);
};

export const getStatisticalDefaultEvalscript = (datasource) => {
  switch (datasource) {
    case S2L1C:
    case S2L2A:
      return DEFAULT_STATISTICAL_S2_EVALSCRIPT;
    case L8L1C:
    case LOTL1:
    case LOTL2:
      return DEFAULT_STATISTICAL_LANDSAT_EVALSCRIPT;
    case MODIS:
      return DEFAULT_STATISTICAL_MODIS_EVALSCRIPT;
    case DEM:
      return DEFAULT_STATISTICAL_DEM_EVALSCRIPT;
    case S1GRD:
      return DEFAULT_STATISTICAL_S1_EVALSCRIPT;
    case S3OLCI:
      return DEFAULT_STATISTICAL_S3OLCI_EVALSCRIPT;
    case S3SLSTR:
      return DEFAULT_STATISTICAL_S3SLSTR_EVALSCRIPT;
    case S5PL2:
      return DEFAULT_STATISTICAL_S5PL2_EVALSCRIPT;
    case CUSTOM:
    case DATAFUSION:
    default:
      return '//VERSION=3\n//Write here your evalscript';
  }
};

export const getProcessDefaultEvalscript = (datasource) => {
  switch (datasource) {
    case S2L1C:
    case S2L2A:
      return DEFAULT_S2_EVALSCRIPT;
    case L8L1C:
    case LOTL1:
    case LOTL2:
      return DEFAULT_LANDSAT_EVALSCRIPT;
    case MODIS:
      return DEFAULT_MODIS_EVALSCRIPT;
    case DEM:
      return DEFAULT_DEM_EVALSCRIPT;
    case S1GRD:
      return DEFAULT_S1_EVALSCRIPT;
    case S3OLCI:
      return DEFAULT_S3OLCI_EVALSCRIPT;
    case S3SLSTR:
      return DEFAULT_S3SLSTR_EVALSCRIPT;
    case S5PL2:
      return DEFAULT_S5PL2_EVALSCRIPT;
    case CUSTOM:
      return DEFAULT_BYOC_EVALSCRIPT;
    case DATAFUSION:
      return DEFAULT_DATAFUSION_EVALSCRIPT;
    default:
      return "// Evalscript don't found for this data collection";
  }
};

export const datasourceToCustomRepoLink = (datasource) => {
  const BASE_LINK = 'https://custom-scripts.sentinel-hub.com/';
  switch (datasource) {
    case S2L1C:
    case S2L2A:
      return `${BASE_LINK}#sentinel-2`;
    case S1GRD:
      return `${BASE_LINK}#sentinel-1`;
    case S3OLCI:
    case S3SLSTR:
      return `${BASE_LINK}#sentinel-3`;
    case S5PL2:
      return `${BASE_LINK}#sentinel-5p`;
    case L8L1C:
    case LOTL1:
    case LOTL2:
      return `${BASE_LINK}#landsat-8`;
    case MODIS:
      return `${BASE_LINK}#modis`;
    case DEM:
      return `${BASE_LINK}#dem`;
    case DATAFUSION:
      return `${BASE_LINK}#data-fusion`;
    default:
      return BASE_LINK;
  }
};
