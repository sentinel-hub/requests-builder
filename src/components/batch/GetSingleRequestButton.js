import React from 'react';
import RequestButton from '../common/RequestButton';
import { addAlertOnError, batchIdValidation } from './lib/utils';
import store from '../../store';
import { groupBatchAggregator } from './BatchInformation';
import batchSlice from '../../store/batch';
import BatchResource from '../../api/batch/BatchResource';

const GetSingleRequestButton = ({
  token,
  requestId,
  setSingleResponse,
  curriyedUpdater,
  setOpenedContainers,
  fetchTiles,
}) => {
  const getSingleBatchHandler = (response) => {
    fetchTiles();
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
      request={BatchResource.getSingleOrder}
      args={[{ orderId: requestId }]}
      style={{ width: '70%', marginTop: '0' }}
    />
  );
};

export default GetSingleRequestButton;
