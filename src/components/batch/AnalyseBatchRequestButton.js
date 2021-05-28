import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './lib/utils';
import store from '../../store';
import batchSlice from '../../store/batch';
import BatchResource from '../../api/batch/BatchResource';

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
      request={BatchResource.analyseOrder}
      args={[{ orderId: requestId }]}
    />
  );
};

export default AnalyseBatchRequestButton;
