import Api from '..';
import { getUrl } from './utils';

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
