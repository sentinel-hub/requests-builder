import moment from 'moment';
import { isAirbus } from '../../components/tpdi/utils';
import { getAirbusOrderBody, getAirbusSearchRequestBody } from './airbus';
import { getMaxarOrderBody, getMaxarSearchRequestBody } from './maxar';
import { getPlanetOrderBody, getPlanetSearchRequestBody } from './planet';

export const getTimeRange = (requestState, isSingleDate) => {
  const timerange = {
    timeRange: {
      from: requestState.timeFrom[0],
    },
  };
  if (isSingleDate) {
    timerange.timeRange.to = moment.utc(requestState.timeFrom[0]).endOf('day').format();
  } else if (requestState.timeTo[0]) {
    timerange.timeRange.to = moment.utc(requestState.timeTo[0]).endOf('day').format();
  }
  return timerange;
};

export const getSearchTpdiBody = (state) => {
  if (isAirbus(state.tpdi.provider)) {
    return getAirbusSearchRequestBody(state);
  } else if (state.tpdi.provider === 'PLANET') {
    return getPlanetSearchRequestBody(state);
  } else if (state.tpdi.provider === 'MAXAR') {
    return getMaxarSearchRequestBody(state);
  }
};

export const tpdiCreateOrderBodyViaDataFilter = (state) => {
  let requestBody = {};
  if (isAirbus(state.tpdi.provider)) {
    requestBody.input = getAirbusSearchRequestBody(state);
  } else if (state.tpdi.provider === 'PLANET') {
    requestBody.input = getPlanetSearchRequestBody(state);
    requestBody.input.planetApiKey = state.planet.planetApiKey;
    requestBody.input.data[0].harmonizeTo = state.planet.harmonizeTo;
  } else if (state.tpdi.provider === 'MAXAR') {
    requestBody.input = getMaxarSearchRequestBody(state);
  }
  requestBody.name = state.tpdi.name;
  if (!state.tpdi.isCreatingCollection && state.tpdi.collectionId !== '') {
    requestBody.collectionId = state.tpdi.collectionId;
  }

  return requestBody;
};

export const tpdiCreateOrderBodyViaProducts = (state) => {
  let requestBody;
  if (isAirbus(state.tpdi.provider)) {
    requestBody = getAirbusOrderBody(state);
  } else if (state.tpdi.provider === 'PLANET') {
    requestBody = getPlanetOrderBody(state);
  } else if (state.tpdi.provider === 'MAXAR') {
    requestBody = getMaxarOrderBody(state);
  }

  if (!state.tpdi.isCreatingCollection && state.tpdi.collectionId !== '') {
    requestBody.collectionId = state.tpdi.collectionId;
  }
  return requestBody;
};
