import React from 'react';
import { connect } from 'react-redux';
import RequestButton from '../RequestButton';
import { analyseBatchRequest } from '../../utils/batchActions';
import { addAlertOnError, batchIdValidation } from './BatchActions';
import store, { batchSlice } from '../../store';

const AnalyseBatchRequestButton = ({ selectedBatchId, token }) => {
  const analyseResponseHandler = () => {
    store.dispatch(
      batchSlice.actions.setExtraInfo(
        'Analysis of request with id: ' + selectedBatchId + ' successfully started.',
      ),
    );
  };

  return (
    <div>
      <RequestButton
        validation={batchIdValidation(token, selectedBatchId)}
        disabledTitle="Log in and set a batch request to use this"
        className="secondary-button"
        buttonText="Analyse"
        responseHandler={analyseResponseHandler}
        errorHandler={addAlertOnError}
        request={analyseBatchRequest}
        args={[token, selectedBatchId]}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedBatchId: state.batch.selectedBatchId,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(AnalyseBatchRequestButton);
