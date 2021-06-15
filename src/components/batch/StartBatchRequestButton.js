import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './lib/utils';

import store from '../../store';
import batchSlice from '../../store/batch';
import BatchResource from '../../api/batch/BatchResource';

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
      request={BatchResource.startOrder}
      args={[{ orderId: requestId }]}
      style={{ width: '70%', marginTop: '0' }}
    />
  );
};

export default StartBatchRequestButton;
