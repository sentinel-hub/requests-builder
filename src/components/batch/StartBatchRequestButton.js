import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './BatchActions';
import { startBatchRequest } from './requests';

import { connect } from 'react-redux';
import store, { batchSlice } from '../../store';

const StartBatchRequestButton = ({ selectedBatchId, token }) => {
  const startResponseHandler = () => {
    store.dispatch(
      batchSlice.actions.setExtraInfo('Successfully Started request with Id: ' + selectedBatchId),
    );
  };
  return (
    <div>
      <RequestButton
        validation={batchIdValidation(token, selectedBatchId)}
        disabledTitle="Log in and set a batch request to use this"
        className="secondary-button"
        buttonText="Start"
        responseHandler={startResponseHandler}
        errorHandler={addAlertOnError}
        request={startBatchRequest}
        args={[token, selectedBatchId]}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedBatchId: state.batch.selectedBatchId,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(StartBatchRequestButton);
