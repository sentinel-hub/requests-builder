import { isEmpty } from '../../../utils/const';
import { isBbox } from '../../common/Map/utils/crsTransform';
import { getSHPYCredentials, getSHPYBounds } from '../../process/lib/generateShPyRequest';

const catalogCollectionToShPy = (collection) => {
  if (collection.includes('byoc-') || collection.includes('batch-')) {
    return `'${collection}'`;
  }

  switch (collection) {
    case 'sentinel-1-grd':
      return 'DataCollection.SENTINEL1';
    case 'sentinel-2-l1c':
      return 'DataCollection.SENTINEL2_L1C';
    case 'sentinel-2-l2a':
      return 'DataCollection.SENTINEL2_L2A';
    case 'sentinel-5p-l2':
      return 'DataCollection.SENTINEL5P';
    case 'sentinel-3-olci':
      return 'DataCollection.SENTINEL3_OLCI';
    case 'sentinel-3-slstr':
      return 'DataCollection.SENTINEL3_SLSTR';
    case 'landsat-8-l1c':
      return 'DataCollection.LANDSAT8';
    default:
      return '<collection-not-supported>';
  }
};
const getShPyDeploymentCatalog = (deploymentUrl) => {
  if (!deploymentUrl) {
    return '<select-deployment>';
  }
  const url = new URL(deploymentUrl).origin;
  return `SentinelHubCatalog(base_url='${url}', config=config)`;
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
  return `${generateImports()}
${getSHPYCredentials()}
catalog = ${getShPyDeploymentCatalog(catalogState.deploymentUrl)}

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
