import React from 'react';
import { connect } from 'react-redux';
import RequestButton from '../common/RequestButton';
import { createBatchRequest } from './requests';
import { addAlertOnError } from './utils';
import { validateRequestState } from '../../utils/validator';

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
    setCreateResponse(JSON.stringify(response, null, 2));
    // open new one and close rest.
    setFetchedRequests((prev) => [
      { ...response, isExpanded: true },
      ...prev.map((req) => ({ ...req, isExpanded: false })),
    ]);
    openOnlyCreateContainer();
  };
  return (
    <RequestButton
      validation={isCreatePossible(batchState, requestState, token)}
      className="secondary-button"
      buttonText="Create"
      request={createBatchRequest}
      args={[requestState, batchState, mapState, token]}
      responseHandler={createResponseHandler}
      errorHandler={addAlertOnError}
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
