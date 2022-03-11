import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import RequestButton from '../common/RequestButton';
import { addAlertOnError } from './lib/utils';
import { validateRequestState } from '../../utils/validator';
import BatchResource from '../../api/batch/BatchResource';
import { generateBatchBodyRequest } from '../../api/batch/utils';
import { isInvalidDatafusionState } from '../../store/request';
import { successfulBatchCreationEvent } from '../../utils/initAnalytics';

const isCreatePossible = (batchState, requestState, token) => {
  const { tillingGrid, resolution, bucketName } = batchState;
  const isValid = validateRequestState(requestState);

  return resolution && bucketName && isValid && tillingGrid !== undefined && token;
};

const CreateBatchRequestButton = ({
  batchState,
  requestState,
  mapState,
  token,
  setFetchedRequests,
  setCreateResponse,
  openOnlyCreateContainer,
}) => {
  const createResponseHandler = (response) => {
    successfulBatchCreationEvent();
    setCreateResponse(JSON.stringify(response, null, 2));
    // open new one and close rest.
    setFetchedRequests((prev) => [
      { ...response, isExpanded: true },
      ...prev.map((req) => ({ ...req, isExpanded: false })),
    ]);
    openOnlyCreateContainer();
  };
  const errorHandler = useCallback((err) => {
    addAlertOnError(err, 'Something went wrong while creating a batch request');
  }, []);

  const isInvalidDatafusion = isInvalidDatafusionState(requestState);
  return (
    <RequestButton
      validation={isCreatePossible(batchState, requestState, token) && !isInvalidDatafusion}
      className="secondary-button"
      buttonText="Create"
      request={BatchResource.createOrder(requestState)}
      args={[generateBatchBodyRequest(requestState, batchState, mapState)]}
      responseHandler={createResponseHandler}
      errorHandler={errorHandler}
    />
  );
};

const mapStateToProps = (state) => ({
  batchState: state.batch,
  requestState: state.request,
  mapState: state.map,
  token: state.auth.user.access_token,
});
export default connect(mapStateToProps)(CreateBatchRequestButton);
