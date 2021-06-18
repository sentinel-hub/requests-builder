import Api from '..';

export const BATCH_BASE_URL = 'https://services.sentinel-hub.com/api/v1/batch';

const { GET, POST, DELETE } = Api;

const BatchResource = {
  createOrder: POST(`${BATCH_BASE_URL}/process`),
  getSingleOrder: GET(`${BATCH_BASE_URL}/process/:orderId`),
  getOrders: GET(`${BATCH_BASE_URL}/process`),
  getNextOrders: (url) => GET(url),
  deleteOrder: DELETE(`${BATCH_BASE_URL}/process/:orderId`),
  analyseOrder: POST(`${BATCH_BASE_URL}/process/:orderId/analyse`),
  startOrder: POST(`${BATCH_BASE_URL}/process/:orderId/start`),
  cancelOrder: POST(`${BATCH_BASE_URL}/process/:orderId/cancel`),
  restartOrder: POST(`${BATCH_BASE_URL}/process/:orderId/restartpartial`),
  getLatestOrders: GET(`${BATCH_BASE_URL}/process?sort=created%3Adesc`),
};

export default BatchResource;
