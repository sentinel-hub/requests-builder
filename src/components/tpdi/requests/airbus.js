import { generateBounds } from '../../process/requests';
import { dataFilterDefaultValues } from '../utils/const';
import { stateConstellationToConstellation } from '../utils';
import { getTimeRange } from './common';

export const getAirbusDataFilterOptions = (dataFilterOptions) => {
  let options = {};
  for (let key in dataFilterOptions) {
    // check if the property is not default or have the default value
    if (dataFilterOptions[key] !== 'DEFAULT' && dataFilterDefaultValues[key] !== dataFilterOptions[key]) {
      options[key] = dataFilterOptions[key];
    }
  }
  return options;
};

export const getAirbusSearchRequestBody = (state) => {
  const request = {
    provider: 'AIRBUS',
    bounds: {
      ...generateBounds(state.map),
    },
    data: [
      {
        constellation: stateConstellationToConstellation[state.tpdi.provider],
        dataFilter: {
          ...getAirbusDataFilterOptions(state.airbus.dataFilterOptions),
          ...getTimeRange(state.request, state.tpdi.isSingleDate),
        },
      },
    ],
  };

  return request;
};

export const getAirbusOrderBody = (state) => {
  const requestBody = {};
  requestBody.input = getAirbusSearchRequestBody(state);
  requestBody.name = state.tpdi.name;
  requestBody.collectionId = state.tpdi.collectionId;
  delete requestBody.input.data[0].dataFilter;
  requestBody.input.data[0].products = state.tpdi.products.map((product) => ({
    id: product.id,
  }));

  return requestBody;
};
