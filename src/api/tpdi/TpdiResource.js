import Api from '..';

const BASE_TPDI_URL = 'https://services.sentinel-hub.com/api/v1/dataimport';

const { GET, POST, DELETE } = Api;

const TpdiResource = {
  getOrders: GET(`${BASE_TPDI_URL}/orders`),
  getQuota: GET(`${BASE_TPDI_URL}/quotas`),
  search: POST(`${BASE_TPDI_URL}/search`),
  searchRest: (nextUrl) => POST(nextUrl),
  createOrder: POST(`${BASE_TPDI_URL}/orders`),
  deleteOrder: DELETE(`${BASE_TPDI_URL}/orders/:orderId`),
  confirmOrder: POST(`${BASE_TPDI_URL}/orders/:orderId/confirm`),
  getDeliveries: GET(`${BASE_TPDI_URL}/orders/:orderId/deliveries`),
  getThumbnail: GET(`${BASE_TPDI_URL}/collections/:collectionId/products/:productId/thumbnail`),
};

export default TpdiResource;
