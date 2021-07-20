import {
  DEFAULT_LANDSAT_EVALSCRIPT,
  DEFAULT_MODIS_EVALSCRIPT,
  DEFAULT_S2_EVALSCRIPT,
  DEFAULT_DEM_EVALSCRIPT,
  DEFAULT_BYOC_EVALSCRIPT,
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
  DEFAULT_LTML_EVALSCRIPT,
  DEFAULT_STATISTICAL_LTML_EVALSCRIPT,
} from './constEvalscript';

const EU_CENTRAL_LOCATION = 'aws-eu-central-1';
const US_WEST_LOCATION = 'aws-us-west-2';
const CREODIAS_LOCATION = 'creo';
// const CODEDE_LOCATION = 'codede';

export const OLD_S2L1C = 'S2L1C';
export const OLD_S2L2A = 'S2L2A';
export const OLD_LOTL1 = 'LOTL1';
export const OLD_LOTL2 = 'LOTL2';
export const OLD_MODIS = 'MODIS';
export const OLD_DEM = 'DEM';
export const OLD_S1GRD = 'S1GRD';
export const OLD_S3OLCI = 'S3OLCI';
export const OLD_S3SLSTR = 'S3SLSTR';
export const OLD_S5PL2 = 'S5PL2';
export const OLD_CUSTOM = 'CUSTOM';
export const OLD_LMSSL1 = 'LMSSL1';
export const OLD_LETML1 = 'LETML1';
export const OLD_LETML2 = 'LETML2';

export const S2L1C = 'sentinel-2-l1c';
export const S2L2A = 'sentinel-2-l2a';
export const LOTL1 = 'landsat-ot-l1';
export const LOTL2 = 'landsat-ot-l2';
export const MODIS = 'modis';
export const DEM = 'dem';
export const S1GRD = 'sentinel-1-grd';
export const S3OLCI = 'sentinel-3-olci';
export const S3SLSTR = 'sentinel-3-slstr';
export const S5PL2 = 'sentinel-5p-l2';
export const LTML1 = 'landsat-tm-l1';
export const LTML2 = 'landsat-tm-l2';
export const LMSSL1 = 'landsat-mss-l1';
export const LETML1 = 'landsat-etm-l1';
export const LETML2 = 'landsat-etm-l2';
export const CUSTOM = 'custom';

export const OLD_DATASOURCES_TO_NEW_MAP = {
  [OLD_S2L1C]: S2L1C,
  [OLD_S2L2A]: S2L2A,
  [OLD_LOTL1]: LOTL1,
  [OLD_LOTL2]: LOTL2,
  [OLD_MODIS]: MODIS,
  [OLD_DEM]: DEM,
  [OLD_S1GRD]: S1GRD,
  [OLD_S3OLCI]: S3OLCI,
  [OLD_S3SLSTR]: S3SLSTR,
  [OLD_S5PL2]: S5PL2,
  [OLD_LMSSL1]: LMSSL1,
  [OLD_LETML1]: LETML1,
  [OLD_LETML2]: LETML2,
  [OLD_CUSTOM]: CUSTOM,
};

export const DATASOURCES = {
  [S2L1C]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l1c',
    isBatchSupported: true,
    isStatApiSupported: true,
    region: EU_CENTRAL_LOCATION,
  },
  [S2L2A]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l2a',
    isBatchSupported: true,
    isStatApiSupported: true,
    region: EU_CENTRAL_LOCATION,
  },
  [LOTL1]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'lotl1',
    isBatchSupported: false,
    isStatApiSupported: true,
    region: US_WEST_LOCATION,
  },
  [LOTL2]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'lotl2',
    isBatchSupported: false,
    isStatApiSupported: true,
    region: US_WEST_LOCATION,
  },
  [LTML1]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'ltml1',
    isBatchSupported: false,
    isStatApiSupported: true,
    region: US_WEST_LOCATION,
  },
  [LTML2]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'ltml2',
    isBatchSupported: false,
    isStatApiSupported: true,
  },
  [LMSSL1]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'lmssl1',
    isBatchSupported: false,
    isStatApiSupported: true,
  },
  [LETML1]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'letml1',
    isBatchSupported: false,
    isStatApiSupported: true,
  },
  [LETML2]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'letml2',
    isBatchSupported: false,
    isStatApiSupported: true,
  },
  [MODIS]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'modis',
    isBatchSupported: false,
    isStatApiSupported: true,
    region: US_WEST_LOCATION,
  },
  [DEM]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'dem',
    isBatchSupported: true,
    isStatApiSupported: false,
    region: EU_CENTRAL_LOCATION,
  },
  [S1GRD]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 's1',
    isBatchSupported: true,
    isStatApiSupported: true,
    region: EU_CENTRAL_LOCATION,
  },
  [S3OLCI]: {
    url: 'https://creodias.sentinel-hub.com/api/v1',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'olci',
    isBatchSupported: false,
    isStatApiSupported: false,
    region: CREODIAS_LOCATION,
  },
  [S3SLSTR]: {
    url: 'https://creodias.sentinel-hub.com/api/v1',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'slstr',
    isBatchSupported: false,
    isStatApiSupported: false,
    region: CREODIAS_LOCATION,
  },
  [S5PL2]: {
    url: 'https://creodias.sentinel-hub.com/api/v1',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 's5pl2',
    isBatchSupported: false,
    isStatApiSupported: false,
    region: CREODIAS_LOCATION,
  },
  [CUSTOM]: {
    url: 'https://services.sentinel-hub.com/api/v1',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    selectName: 'Bring your own COG',
    isBatchSupported: true,
    isStatApiSupported: true,
  },
};

export const DATASOURCES_NAMES = Object.keys(DATASOURCES);

export const statisticalDataCollectionNames = DATASOURCES_NAMES.filter(
  (key) => DATASOURCES[key].isStatApiSupported,
);

export const batchDataCollectionNames = DATASOURCES_NAMES.filter((key) => DATASOURCES[key].isBatchSupported);

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
    case LOTL1:
    case LOTL2:
      return DEFAULT_STATISTICAL_LANDSAT_EVALSCRIPT;
    case LTML1:
    case LTML2:
    case LETML1:
    case LETML2:
    case LMSSL1:
      return DEFAULT_STATISTICAL_LTML_EVALSCRIPT;
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
    default:
      return '//VERSION=3\n//Write here your evalscript';
  }
};

export const getProcessDefaultEvalscript = (datasource) => {
  switch (datasource) {
    case S2L1C:
    case S2L2A:
      return DEFAULT_S2_EVALSCRIPT;
    case LOTL1:
    case LOTL2:
      return DEFAULT_LANDSAT_EVALSCRIPT;
    case LTML1:
    case LTML2:
    case LETML1:
    case LETML2:
    case LMSSL1:
      return DEFAULT_LTML_EVALSCRIPT;
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
    case LOTL1:
    case LOTL2:
      return `${BASE_LINK}#landsat-8`;
    case LTML1:
    case LTML2:
      return `${BASE_LINK}#landsat-5-and-7`;
    case MODIS:
      return `${BASE_LINK}#modis`;
    case DEM:
      return `${BASE_LINK}#dem`;
    default:
      return BASE_LINK;
  }
};
