import { StopIcon } from '@heroicons/react/solid';
import React from 'react';
import TpdiResource from '../../../api/tpdi/TpdiResource';
import { addSuccessAlert } from '../../../store/alert';
import RequestButton from '../../common/RequestButton';

const SubscriptionsCancelButton = ({ subscription, handleRefresh }) => {
  const cancelResponseHandler = async () => {
    addSuccessAlert('Successfully canceled!');
    await handleRefresh();
  };
  if (subscription.status !== 'RUNNING') {
    return null;
  }
  return (
    <RequestButton
      className="secondary-button h-9 flex items-center"
      buttonText={
        <>
          <StopIcon className="w-5 mr-1" />
          Cancel
        </>
      }
      request={TpdiResource.cancelSubscription}
      args={[{ subscriptionId: subscription.id }]}
      responseHandler={cancelResponseHandler}
      validation
    />
  );
};

export default SubscriptionsCancelButton;
