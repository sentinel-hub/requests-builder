import Api from '..';
import { collectionIdToUrl, datasourceToCollection } from '../../components/catalog/const';
import { getBaseUrlByDeployment } from '../../utils/const/const';

const CATALOG_PATH = 'api/v1/catalog';

const { GET, POST } = Api;

const CatalogResource = {
  search: (deploymentUrl) => POST(`${deploymentUrl}search`, { isFullUrl: true }),
  getCollections: (deploymentUrl) => GET(`${deploymentUrl}collections`, { isFullUrl: true }),

  fetchBounds: (location) => {
    return GET(
      `${getBaseUrlByDeployment(
        location,
      )}${CATALOG_PATH}/search?bbox=-180,-90,180,90&collections=:collectionType-:collectionId&datetime=../..`,
      { isFullUrl: true },
    );
  },
  fetchDates: (datasource) =>
    POST(`${collectionIdToUrl(datasourceToCollection[datasource])}search`, { isFullUrl: true }),
};

export default CatalogResource;
