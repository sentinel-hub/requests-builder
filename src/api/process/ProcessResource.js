import Api from '..';
import { CUSTOM, DATASOURCES } from '../../utils/const';

export const byocLocationToBaseUrl = (location) => {
  if (location === 'aws-eu-central-1') {
    return 'https://services.sentinel-hub.com/';
  } else if (location === 'aws-us-west-2') {
    return 'https://services-uswest2.sentinel-hub.com/';
  }
  return 'https://services.sentinel-hub.com/';
};

const { POST } = Api;

const getTarHeader = (responses) => {
  if (responses.length > 1) {
    return {
      Accept: 'application/tar',
    };
  }
  return {};
};

const getUrl = (requestState) => {
  if (requestState.datasource === CUSTOM) {
    return byocLocationToBaseUrl(requestState.byocLocation) + 'api/v1/process';
  } else {
    return DATASOURCES[requestState.datasource].url;
  }
};

const ProcessResource = {
  stateRequest: (requestState) =>
    POST(
      getUrl(requestState),
      {
        authenticated: true,
        endpointHeaders: {
          ...getTarHeader(requestState.responses),
        },
      },
      '*/*',
    ),
};

export default ProcessResource;
