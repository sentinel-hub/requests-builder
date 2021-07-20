import Api from '..';
import { getProcessUrl } from '../url';

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
      getProcessUrl(requestState),
      {
        authenticated: true,
        endpointHeaders: {
          ...getTarHeader(requestState.responses),
        },
      },
      '*/*',
      true,
    ),
};

export default ProcessResource;
