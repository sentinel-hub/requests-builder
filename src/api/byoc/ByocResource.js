import Api from '..';

const BYOC_PATH = '/api/v1/byoc';

const { GET } = Api;

const ByocResource = {
  getCollections: GET(`${BYOC_PATH}/global`),
};

export default ByocResource;
