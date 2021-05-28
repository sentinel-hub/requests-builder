import Api from '..';
import { collectionIdToUrl, datasourceToCollection } from '../../components/catalog/const';

const CATALOG_BASE_URL = 'https://services.sentinel-hub.com/api/v1/catalog';

const { GET, POST } = Api;

const CatalogResource = {
  search: (deploymentUrl) => POST(`${deploymentUrl}search`),
  getCollections: (deploymentUrl) => GET(`${deploymentUrl}collections`),

  fetchBounds: GET(
    `${CATALOG_BASE_URL}/search?bbox=-180,-90,180,90&collections=:collectionType-:collectionId`,
  ),
  fetchDates: (datasource) => POST(`${collectionIdToUrl[datasourceToCollection[datasource]]}search`),
};

export default CatalogResource;
