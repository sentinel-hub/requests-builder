import Api from '..';
import { getUrl } from './utils';

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
