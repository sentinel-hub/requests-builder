import Api from '..';

const WMS_PATH = '/configuration/v1/wms';

const { GET } = Api;

const WmsResource = {
  getInstances: GET(`${WMS_PATH}/instances`),
  getLayers: GET(`${WMS_PATH}/instances/:instanceId/layers`),
};

export default WmsResource;
