import React from 'react';
import RequestButton from '../common/RequestButton';
import { sendEditedBatchRequest } from './requests';
import store, { batchSlice } from '../../store';
import { addAlertOnError } from './BatchActions';

const SendEditedBatchRequest = ({ text, token, setFetchedRequests }) => {
  const responseHandler = (response) => {
    setFetchedRequests([response]);
    store.dispatch(batchSlice.actions.setSelectedBatchId(response['id']));
  };
  return (
    <>
      <RequestButton
        buttonText="Send Edited Request"
        className="secondary-button"
        validation={Boolean(token)}
        request={sendEditedBatchRequest}
        args={[token, text]}
        disabledTitle="Log in to use this"
        responseHandler={responseHandler}
        errorHandler={addAlertOnError}
      />
    </>
  );
};

export default SendEditedBatchRequest;
