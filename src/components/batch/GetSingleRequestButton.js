import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './utils';
import { getSingleBatchRequest } from './requests';
import store from '../../store';
import { groupBatchAggregator } from './BatchInformation';
import batchSlice from '../../store/batch';

const GetSingleRequestButton = ({
  token,
  requestId,
  setSingleResponse,
  curriyedUpdater,
  setOpenedContainers,
}) => {
  const getSingleBatchHandler = (response) => {
    setSingleResponse(JSON.stringify(response, null, 2));
    curriyedUpdater(response)(requestId);
    store.dispatch(batchSlice.actions.setExtraInfo(''));
    const newContainerStatus = groupBatchAggregator(response);
    setOpenedContainers([
      newContainerStatus === 'CREATED',
      newContainerStatus === 'RUNNING',
      newContainerStatus === 'FINISHED',
    ]);
  };

  return (
    <RequestButton
      validation={batchIdValidation(token, requestId)}
      disabledTitle="Log in and set a batch request to use this"
      className="secondary-button"
      buttonText="Refresh request"
      responseHandler={getSingleBatchHandler}
      errorHandler={addAlertOnError}
      request={getSingleBatchRequest}
      args={[token, requestId]}
    />
  );
};

export default GetSingleRequestButton;
