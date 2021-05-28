import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './lib/utils';
import store from '../../store';
import batchSlice from '../../store/batch';
import BatchResource from '../../api/batch/BatchResource';

const RestartPartialRequestButton = ({ requestId, token }) => {
  const responseHandler = () => {
    store.dispatch(
      batchSlice.actions.setExtraInfo('Request with id ' + requestId + ' successfully restarted'),
    );
  };

  const errorHandler = (error) => {
    addAlertOnError(error, 'Only Requests with status PARTIAL can be restarted');
  };

  return (
    <RequestButton
      buttonText="Restart Partial Request"
      responseHandler={responseHandler}
      errorHandler={errorHandler}
      validation={batchIdValidation(token, requestId)}
      disabledTitle="Log in and set a batch request id to use this"
      request={BatchResource.restartOrder}
      args={[{ orderId: requestId }]}
      className="secondary-button"
    />
  );
};

export default RestartPartialRequestButton;
