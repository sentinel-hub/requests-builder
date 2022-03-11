import Api from '..';

export const TPDI_PATH = `/api/v1/dataimport`;
export const SUBSCRIPTIONS_PATH = `${TPDI_PATH}/subscriptions`;

const { GET, POST, DELETE } = Api;

const TpdiResource = {
  getOrders: GET(`${TPDI_PATH}/orders`),
  getQuota: GET(`${TPDI_PATH}/quotas`),
  search: POST(`${TPDI_PATH}/search`),
  searchRest: (nextUrl) => POST(nextUrl, { isFullUrl: true }),
  createOrder: POST(`${TPDI_PATH}/orders`),
  searchCompatibleCollections: POST(`${TPDI_PATH}/orders/searchcompatiblecollections`),
  deleteOrder: DELETE(`${TPDI_PATH}/orders/:orderId`),
  confirmOrder: POST(`${TPDI_PATH}/orders/:orderId/confirm`),
  getDeliveries: GET(`${TPDI_PATH}/orders/:orderId/deliveries`),
  getThumbnail: GET(`${TPDI_PATH}/collections/:collectionId/products/:productId/thumbnail`),
  createSubscription: POST(`${SUBSCRIPTIONS_PATH}`),
  getSubscriptions: GET(`${SUBSCRIPTIONS_PATH}`),
  getSubscription: GET(`${SUBSCRIPTIONS_PATH}/:subscriptionId`),
  cancelSubscription: POST(`${SUBSCRIPTIONS_PATH}/:subscriptionId/cancel`),
  deleteSubscription: DELETE(`${SUBSCRIPTIONS_PATH}/:subscriptionId`),
  startSubscription: POST(`${SUBSCRIPTIONS_PATH}/:subscriptionId/confirm`),
  getSubscriptionDeliveries: GET(`${SUBSCRIPTIONS_PATH}/:subscriptionId/deliveries`),
};

export default TpdiResource;
