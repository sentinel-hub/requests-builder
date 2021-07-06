import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import responsesSlice from '../../store/responses';
import alertSlice from '../../store/alert';
import RequestButton from '../common/RequestButton';
import { statisticalRequestStateSelector } from './utils/utils';
import StatisticalResource from '../../api/statistical/StatisticalResource';
import { getStatisticalRequestBody } from '../../api/statistical/utils';
import { DATASOURCES } from '../../utils/const/const';
import { getMessageFromApiError } from '../../api';
import { isInvalidDatafusionState } from '../../store/request';

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
  const msg = getMessageFromApiError(err);
  store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: msg }));
};

const StatisticalSendRequestButton = ({
  dataCollections,
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

  const isInvalidDatafusion = isInvalidDatafusionState({ dataCollections, appMode: 'STATISTICAL' });

  return (
    <RequestButton
      className="button"
      buttonText="Send Request"
      request={StatisticalResource.statisticalRequest(DATASOURCES[dataCollections[0].type]?.url)}
      additionalClassNames={['mr-2']}
      args={[
        getStatisticalRequestBody(
          dataCollections,
          dataFilterOptions,
          processingOptions,
          bounds,
          dimensions,
          evalscript,
          timeRange,
          statisticalState,
        ),
      ]}
      validation={Boolean(token && !isInvalidDatafusion)}
      responseHandler={statisticsResponseHandler}
      errorHandler={statisticsErrorHandler}
      useShortcut
      shouldTriggerIsRunningRequest
    />
  );
};

export default connect(statisticalRequestStateSelector)(StatisticalSendRequestButton);
