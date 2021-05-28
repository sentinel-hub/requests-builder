import Api from '..';
import { BATCH_BASE_URL } from './BatchResource';

const { GET } = Api;

const TileResource = {
  getTiles: GET(`${BATCH_BASE_URL}/process/:orderId/tiles`),
  retryTile: GET(`${BATCH_BASE_URL}/process/:orderId/tiles/restart`),
  getNextTiles: (url) => GET(url),
};

export default TileResource;
