import Api from '..';
import { getBaseUrlByDeployment } from '../../utils/const/const';
import { getBatchUrl } from '../url';

const { GET, POST, DELETE } = Api;

const BatchResource = {
  createOrder: (requestState) => POST(`${getBatchUrl(requestState)}/process`, undefined, undefined, true),
  getSingleOrder: (deploymentState) =>
    GET(
      `${getBaseUrlByDeployment(deploymentState)}api/v1/batch/process/:orderId`,
      undefined,
      undefined,
      true,
    ),
  getOrders: (deploymentState) =>
    GET(`${getBaseUrlByDeployment(deploymentState)}api/v1/batch/process`, undefined, undefined, true),
  getNextOrders: (url) => GET(url, undefined, undefined, true),
  deleteOrder: (orderDeployement) =>
    DELETE(
      `${getBaseUrlByDeployment(orderDeployement)}api/v1/batch/process/:orderId`,
      undefined,
      undefined,
      true,
    ),
  analyseOrder: (orderDeployement) =>
    POST(
      `${getBaseUrlByDeployment(orderDeployement)}api/v1/batch/process/:orderId/analyse`,
      undefined,
      undefined,
      true,
    ),
  startOrder: (orderDeployement) =>
    POST(
      `${getBaseUrlByDeployment(orderDeployement)}api/v1/batch/process/:orderId/start`,
      undefined,
      undefined,
      true,
    ),
  cancelOrder: (orderDeployment) =>
    POST(
      `${getBaseUrlByDeployment(orderDeployment)}api/v1/batch/process/:orderId/cancel`,
      undefined,
      undefined,
      true,
    ),
  restartOrder: (orderDeployment) =>
    POST(
      `${getBaseUrlByDeployment(orderDeployment)}api/v1/batch/process/:orderId/restartpartial`,
      undefined,
      undefined,
      true,
    ),
  getLatestOrders: (stateDeployment) =>
    GET(
      `${getBaseUrlByDeployment(stateDeployment)}api/v1/batch/process?sort=created%3Adesc`,
      undefined,
      undefined,
      true,
    ),
};

export default BatchResource;
