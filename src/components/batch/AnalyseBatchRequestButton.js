import React from 'react';
import RequestButton from '../common/RequestButton';
import { analyseBatchRequest } from './requests';
import { addAlertOnError, batchIdValidation } from './utils';
import store from '../../store';
import batchSlice from '../../store/batch';

const AnalyseBatchRequestButton = ({ requestId, token, analyseRequest, setOpenedContainers }) => {
  const analyseResponseHandler = () => {
    store.dispatch(
      batchSlice.actions.setExtraInfo('Analysis of request with id: ' + requestId + ' successfully started.'),
    );
    analyseRequest(requestId);
    setOpenedContainers([true, false, false]);
  };

  return (
    <RequestButton
      validation={batchIdValidation(token, requestId)}
      disabledTitle="Log in and set a batch request to use this"
      className="secondary-button"
      buttonText="Analyse"
      responseHandler={analyseResponseHandler}
      errorHandler={addAlertOnError}
      request={analyseBatchRequest}
      args={[token, requestId]}
    />
  );
};

export default AnalyseBatchRequestButton;
