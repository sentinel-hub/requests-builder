import { generateBounds } from '../process/utils';
import { getTimeRange } from './common';

export const getPlanetSearchRequestBody = (state) => {
  const request = {
    provider: state.tpdi.provider,
    planetApiKey: state.planet.planetApiKey,
    bounds: {
      ...generateBounds(state.map),
    },
    data: [
      {
        itemType: 'PSScene4Band',
        productBundle: 'analytic',
        dataFilter: {
          ...getTimeRange(state.request, state.tpdi.isSingleDate),
          maxCloudCoverage: state.planet.maxCloudCoverage,
        },
      },
    ],
  };
  return request;
};

export const getPlanetOrderBody = (state) => {
  const requestBody = {};
  requestBody.input = getPlanetSearchRequestBody(state);
  requestBody.name = state.tpdi.name;
  requestBody.collectionId = state.tpdi.collectionId;
  delete requestBody.input.data[0].dataFilter;
  requestBody.input.data[0].productBundle = 'analytic';
  requestBody.input.data[0].itemIds = state.tpdi.products.map((product) => product.id);
  requestBody.input.data[0].harmonizeTo = state.planet.harmonizeTo;
  return requestBody;
};
