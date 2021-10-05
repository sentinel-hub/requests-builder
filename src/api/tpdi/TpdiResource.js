import Api from '..';

export const TPDI_PATH = `/api/v1/dataimport`;

const { GET, POST, DELETE } = Api;

const TpdiResource = {
  getOrders: GET(`${TPDI_PATH}/orders`),
  getQuota: GET(`${TPDI_PATH}/quotas`),
  search: POST(`${TPDI_PATH}/search`),
  searchRest: (nextUrl) => POST(nextUrl, undefined, undefined, true),
  createOrder: POST(`${TPDI_PATH}/orders`),
  searchCompatibleCollections: POST(`${TPDI_PATH}/orders/searchcompatiblecollections`),
  deleteOrder: DELETE(`${TPDI_PATH}/orders/:orderId`),
  confirmOrder: POST(`${TPDI_PATH}/orders/:orderId/confirm`),
  getDeliveries: GET(`${TPDI_PATH}/orders/:orderId/deliveries`),
  getThumbnail: GET(`${TPDI_PATH}/collections/:collectionId/products/:productId/thumbnail`),
};

export default TpdiResource;
