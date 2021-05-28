import Api from '..';

const BYOC_BASE_URL = 'https://services.sentinel-hub.com/api/v1/byoc';

const { GET } = Api;

const ByocResource = {
  getCollections: GET(`${BYOC_BASE_URL}/global`),
};

export default ByocResource;
