import React from 'react';
import RequestButton from '../common/RequestButton';
import { connect } from 'react-redux';
import { addAlertOnError, batchIdValidation } from './BatchActions';
import { getSingleBatchRequest } from './requests';
import store from '../../store';
import batchSlice from '../../store/batch';

const GetSingleRequestButton = ({ token, selectedBatchId, setFetchedRequests, setSingleResponse }) => {
  const getSingleBatchHandler = (response) => {
    setSingleResponse(JSON.stringify(response, null, 2));
    store.dispatch(batchSlice.actions.setExtraInfo(''));
    setFetchedRequests([response]);
  };
  return (
    <div>
      <RequestButton
        validation={batchIdValidation(token, selectedBatchId)}
        disabledTitle="Log in and set a batch request to use this"
        className="secondary-button"
        buttonText="Get batch request by id"
        responseHandler={getSingleBatchHandler}
        errorHandler={addAlertOnError}
        request={getSingleBatchRequest}
        args={[token, selectedBatchId]}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
  selectedBatchId: state.batch.selectedBatchId,
});

export default connect(mapStateToProps)(GetSingleRequestButton);
