import { isEmpty } from '../../../utils/commonUtils';
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
} from '../../../utils/const/const';
import { isBbox } from '../../common/Map/utils/crsTransform';
import { getSHPYCredentials, getSHPYBounds, versionComment } from '../../process/lib/generateShPyRequest';

const catalogCollectionToShPy = (collection) => {
  if (collection.includes('byoc-') || collection.includes('batch-')) {
    return `'${collection}'`;
  }

  switch (collection) {
    case S1GRD:
      return `DataCollection.SENTINEL1`;
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
const getDeploymentUrlConfig = (deploymentUrl) => {
  if (!deploymentUrl) {
    return 'config.sh_base_url = <select-deployment>\n';
  }
  const url = new URL(deploymentUrl).origin;
  return `config.sh_base_url = '${url}'\n`;
};

const generateShPyCatalogQuery = (queryProperties) => {
  if (queryProperties && queryProperties.length > 0) {
    const res = queryProperties.reduce((acc, query) => {
      acc[query.propertyName] = {
        [query.operator]: query.propertyValue,
      };
      return acc;
    }, {});
    return `\n  query=${JSON.stringify(res, null, 4)},`;
  }
  return '';
};

const generateShPyCatalogFields = (catalogState) => {
  const { disableInclude, disableExclude, includeFields, excludeFields } = catalogState;
  const res = {};
  if (!disableInclude && includeFields.length > 0) {
    res.include = includeFields;
  }
  if (!disableExclude && excludeFields.length > 0) {
    res.exclude = excludeFields;
  }
  if (!isEmpty(res)) {
    return `\n  fields=${JSON.stringify(res, null, 4)},`;
  }
  return '';
};

const generateImports = () => {
  return 'from sentinelhub import SentinelHubCatalog, BBox, Geometry, SHConfig, CRS, DataCollection';
};

export const generateShPyCatalogRequest = (catalogState, mapState, timeRange) => {
  const { timeFrom } = timeRange;
  const { timeTo } = timeRange;
  return `${versionComment}${generateImports()}
${getSHPYCredentials()}
${getDeploymentUrlConfig(catalogState.deploymentUrl)}
catalog = catalog = SentinelHubCatalog(config=config)

${getSHPYBounds(mapState, true)}
search_iterator = catalog.search(
  ${catalogCollectionToShPy(catalogState.selectedCollection)},\
  ${!isBbox(mapState.wgs84Geometry) ? '\n  geometry=geometry,' : '\n  bbox=bbox,'}
  time=('${timeFrom.split('T')[0]}', '${timeTo.split('T')[0]}'),\
  ${generateShPyCatalogQuery(catalogState.queryProperties)}\
  ${generateShPyCatalogFields(catalogState)}
)

results = list(search_iterator)
`;
};
