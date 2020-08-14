import React from 'react';
import { connect } from 'react-redux';
import RequestButton from '../RequestButton';
import { createBatchRequest } from '../../utils/batchActions';
import store, { batchSlice } from '../../store';
import { addAlertOnError } from './BatchActions';
import { validateRequestState } from '../../utils/validator';

const isCreatePossible = (batchState, requestState, token) => {
  const { tillingGrid, resolution, bucketName } = batchState;
  const isValid = validateRequestState(requestState);

  return resolution && bucketName && isValid && tillingGrid !== undefined && token;
};

const CreateBatchRequestButton = ({ batchState, requestState, token, setFetchedRequests }) => {
  const createResponseHandler = (response) => {
    setFetchedRequests([response]);
    store.dispatch(batchSlice.actions.setSelectedBatchId(response['id']));
  };
  return (
    <div>
      <RequestButton
        validation={isCreatePossible(batchState, requestState, token)}
        className="secondary-button"
        buttonText="Create"
        request={createBatchRequest}
        args={[requestState, batchState, token]}
        responseHandler={createResponseHandler}
        errorHandler={addAlertOnError}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  batchState: state.batch,
  requestState: state.request,
  token: state.auth.user.access_token,
});
export default connect(mapStateToProps)(CreateBatchRequestButton);
