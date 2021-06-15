import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './lib/utils';

import store from '../../store';
import batchSlice from '../../store/batch';
import BatchResource from '../../api/batch/BatchResource';

const CancelBatchRequestButton = ({ requestId, token, cancelRequest }) => {
  const cancelResponseHandler = () => {
    store.dispatch(batchSlice.actions.setExtraInfo('Successfully Cancelled request with Id: ' + requestId));
    cancelRequest(requestId);
  };
  return (
    <RequestButton
      validation={batchIdValidation(token, requestId)}
      disabledTitle="Log in and set a batch request to use this"
      className="secondary-button secondary-button--cancel"
      buttonText="Cancel"
      responseHandler={cancelResponseHandler}
      errorHandler={addAlertOnError}
      request={BatchResource.cancelOrder}
      args={[{ orderId: requestId }]}
      style={{ width: '70%', marginTop: '0' }}
    />
  );
};

export default CancelBatchRequestButton;
