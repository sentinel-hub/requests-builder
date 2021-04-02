import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './utils';
import { restartPartialRequest } from './requests';
import store from '../../store';
import batchSlice from '../../store/batch';

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
      request={restartPartialRequest}
      args={[requestId, token]}
      className="secondary-button"
    />
  );
};

export default RestartPartialRequestButton;
