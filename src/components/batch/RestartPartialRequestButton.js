import React from 'react';
import { connect } from 'react-redux';
import RequestButton from '../RequestButton';
import { addAlertOnError, batchIdValidation } from './BatchActions';
import { restartPartialRequest } from '../../utils/batchActions';
import store, { batchSlice } from '../../store';

const RestartPartialRequestButton = ({ selectedBatchId, token }) => {
  const responseHandler = () => {
    store.dispatch(
      batchSlice.actions.setExtraInfo('Request with id ' + selectedBatchId + ' successfully restarted'),
    );
  };

  const errorHandler = (error) => {
    addAlertOnError(error, 'Only Requests with status PARTIAL can be restarted');
  };

  return (
    <div>
      <RequestButton
        buttonText="Restart Partial Request"
        responseHandler={responseHandler}
        errorHandler={errorHandler}
        validation={batchIdValidation(token, selectedBatchId)}
        disabledTitle="Log in and set a batch request id to use this"
        request={restartPartialRequest}
        args={[selectedBatchId, token]}
        className="secondary-button"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedBatchId: state.batch.selectedBatchId,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(RestartPartialRequestButton);
