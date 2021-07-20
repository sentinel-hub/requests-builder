import Api from '..';

export const BATCH_PATH = '/api/v1/batch';

const { GET, POST, DELETE } = Api;

const BatchResource = {
  createOrder: POST(`${BATCH_PATH}/process`),
  getSingleOrder: GET(`${BATCH_PATH}/process/:orderId`),
  getOrders: GET(`${BATCH_PATH}/process`),
  getNextOrders: (url) => GET(url, undefined, undefined, true),
  deleteOrder: DELETE(`${BATCH_PATH}/process/:orderId`),
  analyseOrder: POST(`${BATCH_PATH}/process/:orderId/analyse`),
  startOrder: POST(`${BATCH_PATH}/process/:orderId/start`),
  cancelOrder: POST(`${BATCH_PATH}/process/:orderId/cancel`),
  restartOrder: POST(`${BATCH_PATH}/process/:orderId/restartpartial`),
  getLatestOrders: GET(`${BATCH_PATH}/process?sort=created%3Adesc`),
};

export default BatchResource;
