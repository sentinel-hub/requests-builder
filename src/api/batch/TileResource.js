import Api from '..';
import { getBaseUrlByDeployment } from '../../utils/const/const';

const { GET } = Api;

const TileResource = {
  getTiles: (deployment) =>
    GET(`${getBaseUrlByDeployment(deployment)}api/v1/batch/process/:orderId/tiles`, { isFullUrl: true }),
  retryTile: (deployment) =>
    GET(`${getBaseUrlByDeployment(deployment)}api/v1/batch/process/:orderId/tiles/restart`, {
      isFullUrl: true,
    }),
  getNextTiles: (url) => GET(url, { isFullUrl: true }),
};

export default TileResource;
