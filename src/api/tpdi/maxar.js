import { maxarInitialState } from '../../store/tpdi';
import { generateBounds } from '../process/utils';
import { getTimeRange } from './common';

const nonDefaultProperties = (dict, initialState) =>
  Object.entries(dict)
    .filter(([key, value]) => !(value === initialState[key]))
    .reduce((acc, [k, value]) => ({ ...acc, [k]: value }), {});

export const getMaxarSearchRequestBody = (state) => {
  const request = {
    provider: state.tpdi.provider,
    bounds: {
      ...generateBounds(state.map),
    },
    data: [
      {
        dataFilter: {
          ...getTimeRange(state.request, state.tpdi.isSingleDate),
          ...nonDefaultProperties(state.maxar.dataFilterOptions, maxarInitialState.dataFilterOptions),
        },
        productBands: '4BB',
        productKernel: state.maxar.productKernel,
      },
    ],
  };
  return request;
};

export const getMaxarOrderBody = (state) => {
  const requestBody = {};
  requestBody.input = getMaxarSearchRequestBody(state);
  requestBody.name = state.tpdi.name;
  delete requestBody.input.data[0].dataFilter;
  requestBody.input.data[0].selectedImages = state.tpdi.products.map((product) => product.id);
  return requestBody;
};
