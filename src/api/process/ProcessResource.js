import Api from '..';
import { getUrl } from './utils';

export const byocLocationToBaseUrl = (location) => {
  switch (location) {
    case 'aws-eu-central-1':
      return 'https://services.sentinel-hub.com/';
    case 'aws-us-west-2':
      return 'https://services-uswest2.sentinel-hub.com/';
    case 'creo':
      return 'https://creodias.sentinel-hub.com/';
    case 'codede':
      return 'https://code-de.sentinel-hub.com';
    default:
      return 'https://services.sentinel-hub.com/';
  }
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
