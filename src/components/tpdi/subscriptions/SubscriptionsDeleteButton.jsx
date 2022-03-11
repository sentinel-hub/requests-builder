import { TrashIcon } from '@heroicons/react/solid';
import React from 'react';
import TpdiResource from '../../../api/tpdi/TpdiResource';
import { addSuccessAlert } from '../../../store/alert';
import RequestButton from '../../common/RequestButton';

const SubscriptionsDeleteButton = ({ subscription, setSubscriptions }) => {
  const deleteResponseHandler = () => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscription.id));
    addSuccessAlert('Successfully deleted!');
  };
  if (subscription.status === 'RUNNING') {
    return null;
  }
  return (
    <RequestButton
      className="secondary-button h-9 flex items-center"
      buttonText={
        <>
          <TrashIcon className="w-5 mr-1" />
          Delete
        </>
      }
      request={TpdiResource.deleteSubscription}
      args={[{ subscriptionId: subscription.id }]}
      responseHandler={deleteResponseHandler}
      validation
    />
  );
};

export default SubscriptionsDeleteButton;
