import Api from '..';
import { getBaseUrlByDeployment } from '../../utils/const/const';

const { GET } = Api;

const TileResource = {
  getTiles: (deployment) =>
    GET(
      `${getBaseUrlByDeployment(deployment)}api/v1/batch/process/:orderId/tiles`,
      undefined,
      undefined,
      true,
    ),
  retryTile: (deployment) =>
    GET(`${getBaseUrlByDeployment(deployment)}api/v1/batch/process/:orderId/tiles/restart`),
  getNextTiles: (url) => GET(url, undefined, undefined, true),
};

export default TileResource;
