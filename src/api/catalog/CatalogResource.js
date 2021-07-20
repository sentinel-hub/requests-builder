import Api from '..';
import { collectionIdToUrl, datasourceToCollection } from '../../components/catalog/const';

const CATALOG_PATH = '/api/v1/catalog';

const { GET, POST } = Api;

const CatalogResource = {
  search: (deploymentUrl) => POST(`${deploymentUrl}search`, undefined, undefined, true),
  getCollections: (deploymentUrl) => GET(`${deploymentUrl}collections`, undefined, undefined, true),

  fetchBounds: GET(`${CATALOG_PATH}/search?bbox=-180,-90,180,90&collections=:collectionType-:collectionId`),
  fetchDates: (datasource) =>
    POST(`${collectionIdToUrl[datasourceToCollection[datasource]]}search`, undefined, undefined, true),
};

export default CatalogResource;
