import { generateBounds } from '../process/utils';
import { getTimeRange } from './common';

export const getPlanetSearchRequestBody = (state) => {
  const request = {
    provider: state.tpdi.provider,
    bounds: {
      ...generateBounds(state.map),
    },
    data: [
      {
        itemType: 'PSScene4Band',
        productBundle: state.planet.productBundle,
        dataFilter: {
          ...getTimeRange(state.request, state.tpdi.isSingleDate),
          maxCloudCoverage: state.planet.maxCloudCoverage,
        },
      },
    ],
  };
  return request;
};

const generateSubscriptionsTimeRange = (requestState) => {
  if (!requestState.timeTo[0]) {
    return {
      timeRange: {
        from: requestState.timeFrom[0],
      },
    };
  }
  return {
    timeRange: {
      from: requestState.timeFrom[0],
      to: requestState.timeTo[0],
    },
  };
};
export const getPlanetSubscriptionBody = (mapState, planetState, requestState, tpdiState) => {
  const payload = {
    input: {
      provider: 'PLANET',
      planetApiKey: planetState.planetApiKey,
      bounds: {
        ...generateBounds(mapState),
      },
      data: [
        {
          itemType: 'PSScene4Band',
          productBundle: planetState.productBundle,
          dataFilter: {
            ...generateSubscriptionsTimeRange(requestState),
            maxCloudCoverage: planetState.maxCloudCoverage,
          },
        },
      ],
    },
  };

  if (!tpdiState.isCreatingCollection && tpdiState.collectionId) {
    payload.collectionId = tpdiState.collectionId;
  }

  if (tpdiState.name) {
    payload.name = tpdiState.name;
  }

  if (planetState.harmonizeTo) {
    payload.input.data[0].harmonizeTo = planetState.harmonizeTo;
  }

  return payload;
};

export const getPlanetOrderBody = (state) => {
  const requestBody = {};
  requestBody.input = getPlanetSearchRequestBody(state);
  requestBody.name = state.tpdi.name;
  requestBody.input.planetApiKey = state.planet.planetApiKey;
  delete requestBody.input.data[0].dataFilter;
  requestBody.input.data[0].productBundle = state.planet.productBundle;
  requestBody.input.data[0].itemIds = state.tpdi.products.map((product) => product.id);
  requestBody.input.data[0].harmonizeTo = state.planet.harmonizeTo;
  return requestBody;
};
