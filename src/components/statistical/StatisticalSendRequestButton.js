import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import responsesSlice from '../../store/responses';
import alertSlice from '../../store/alert';
import RequestButton from '../common/RequestButton';
import { statisticalRequestStateSelector } from './utils/utils';
import StatisticalResource from '../../api/statistical/StatisticalResource';
import { getStatisticalRequestBody } from '../../api/statistical/utils';

export const statisticsResponseHandler = (response, stringRequest) => {
  if (response === '') {
    store.dispatch(responsesSlice.actions.setError('No content returned, 204'));
    return;
  }
  store.dispatch(
    responsesSlice.actions.setFisResponse({
      response,
      stringRequest,
      mode: 'STATISTICAL',
      displayResponse: true,
    }),
  );
};

const statisticsErrorHandler = (err) => {
  console.error(err);
  store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong' }));
};

const StatisticalSendRequestButton = ({
  datasource,
  datafusionSources,
  byocCollectionType,
  byocCollectionId,
  dataFilterOptions,
  processingOptions,
  evalscript,
  statisticalState,
  token,
  convertedGeometry,
  selectedCrs,
  timeFrom,
  timeTo,
  heightOrRes,
  height,
  width,
}) => {
  const bounds = {
    convertedGeometry,
    selectedCrs,
  };
  const timeRange = {
    timeFrom,
    timeTo,
  };
  const dimensions = {
    heightOrRes,
    height,
    width,
  };

  return (
    <RequestButton
      className="button"
      buttonText="Send Request"
      request={StatisticalResource.statisticalRequest}
      args={[
        getStatisticalRequestBody(
          datasource,
          datafusionSources,
          byocCollectionType,
          byocCollectionId,
          dataFilterOptions,
          processingOptions,
          bounds,
          dimensions,
          evalscript,
          timeRange,
          statisticalState,
        ),
      ]}
      validation={Boolean(token)}
      responseHandler={statisticsResponseHandler}
      useShortcut
      errorHandler={statisticsErrorHandler}
    />
  );
};

export default connect(statisticalRequestStateSelector)(StatisticalSendRequestButton);
