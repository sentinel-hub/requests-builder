import Api from '..';
import { getBaseUrlByDeployment } from '../../utils/const/const';
import { getBatchUrl } from '../url';

const { GET, POST, DELETE } = Api;

const BatchResource = {
  createOrder: (requestState) => POST(`${getBatchUrl(requestState)}/process`, { isFullUrl: true }),
  getSingleOrder: (deploymentState) =>
    GET(`${getBaseUrlByDeployment(deploymentState)}api/v1/batch/process/:orderId`, { isFullUrl: true }),
  getOrders: (deploymentState) =>
    GET(`${getBaseUrlByDeployment(deploymentState)}api/v1/batch/process`, { isFullUrl: true }),
  getNextOrders: (url) => GET(url, { isFullUrl: true }),
  deleteOrder: (orderDeployement) =>
    DELETE(`${getBaseUrlByDeployment(orderDeployement)}api/v1/batch/process/:orderId`, { isFullUrl: true }),
  analyseOrder: (orderDeployement) =>
    POST(`${getBaseUrlByDeployment(orderDeployement)}api/v1/batch/process/:orderId/analyse`, {
      isFullUrl: true,
    }),
  startOrder: (orderDeployement) =>
    POST(`${getBaseUrlByDeployment(orderDeployement)}api/v1/batch/process/:orderId/start`, {
      isFullUrl: true,
    }),
  cancelOrder: (orderDeployment) =>
    POST(`${getBaseUrlByDeployment(orderDeployment)}api/v1/batch/process/:orderId/cancel`, {
      isFullUrl: true,
    }),
  restartOrder: (orderDeployment) =>
    POST(`${getBaseUrlByDeployment(orderDeployment)}api/v1/batch/process/:orderId/restartpartial`, {
      isFullUrl: true,
    }),
  getLatestOrders: (stateDeployment) =>
    GET(`${getBaseUrlByDeployment(stateDeployment)}api/v1/batch/process?sort=created%3Adesc`, {
      isFullUrl: true,
    }),
};

export default BatchResource;
