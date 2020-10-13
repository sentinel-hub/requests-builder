import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './BatchActions';
import { cancelBatchRequest } from './requests';

import { connect } from 'react-redux';
import store, { batchSlice } from '../../store';

const CancelBatchRequestButton = ({ selectedBatchId, token }) => {
  const cancelResponseHandler = () => {
    store.dispatch(
      batchSlice.actions.setExtraInfo('Successfully Cancelled request with Id: ' + selectedBatchId),
    );
  };
  return (
    <div>
      <RequestButton
        validation={batchIdValidation(token, selectedBatchId)}
        disabledTitle="Log in and set a batch request to use this"
        className="secondary-button"
        buttonText="Cancel"
        responseHandler={cancelResponseHandler}
        errorHandler={addAlertOnError}
        request={cancelBatchRequest}
        args={[token, selectedBatchId]}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedBatchId: state.batch.selectedBatchId,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CancelBatchRequestButton);
