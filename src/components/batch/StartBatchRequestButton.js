import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './utils';
import { startBatchRequest } from './requests';

import store from '../../store';
import batchSlice from '../../store/batch';

const StartBatchRequestButton = ({ requestId, token, startRequest, setOpenedContainers }) => {
  const startResponseHandler = () => {
    store.dispatch(batchSlice.actions.setExtraInfo('Successfully Started request with Id: ' + requestId));
    startRequest(requestId);
    // Only open running container
    setOpenedContainers([true, false, false]);
  };
  return (
    <RequestButton
      validation={batchIdValidation(token, requestId)}
      disabledTitle="Log in and set a batch request to use this"
      className="secondary-button"
      buttonText="Start"
      responseHandler={startResponseHandler}
      errorHandler={addAlertOnError}
      request={startBatchRequest}
      args={[token, requestId]}
    />
  );
};

export default StartBatchRequestButton;
