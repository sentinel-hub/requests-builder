import { PlayIcon } from '@heroicons/react/solid';
import React from 'react';
import TpdiResource from '../../../api/tpdi/TpdiResource';
import { addSuccessAlert } from '../../../store/alert';
import RequestButton from '../../common/RequestButton';

const SubscriptionsStartButton = ({ subscription, handleRefresh }) => {
  const startResponseHandler = async () => {
    addSuccessAlert('Successfully started!');
    await handleRefresh();
  };
  if (subscription.status !== 'CREATED') {
    return null;
  }
  return (
    <RequestButton
      className="secondary-button h-9 flex items-center"
      buttonText={
        <>
          <PlayIcon className="w-5 mr-1" />
          Start
        </>
      }
      request={TpdiResource.startSubscription}
      args={[{ subscriptionId: subscription.id }]}
      responseHandler={startResponseHandler}
      validation
    />
  );
};

export default SubscriptionsStartButton;
