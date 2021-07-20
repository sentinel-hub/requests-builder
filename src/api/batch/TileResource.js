import Api from '..';
import { BATCH_PATH } from './BatchResource';

const { GET } = Api;

const TileResource = {
  getTiles: GET(`${BATCH_PATH}/process/:orderId/tiles`),
  retryTile: GET(`${BATCH_PATH}/process/:orderId/tiles/restart`),
  getNextTiles: (url) => GET(url, undefined, undefined, true),
};

export default TileResource;
