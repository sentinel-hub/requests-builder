import React from 'react';
import RequestButton from '../common/RequestButton';
import { getAllDeliveries } from './generateTPDIRequests';

const GetDeliveriesButton = ({ id, token, status, setDeliveries, updateToFinished }) => {
  const handleGetDeliveries = (response) => {
    setDeliveries(response.data);
    if (response.data.every((delivery) => delivery.status === 'DONE')) {
      updateToFinished(id);
    }
  };

  const canGetDeliveries = status !== 'CREATED';

  return (
    <>
      {canGetDeliveries ? (
        <RequestButton
          request={getAllDeliveries}
          args={[token, id]}
          buttonText="Get deliveries"
          validation={Boolean(token)}
          className="secondary-button"
          responseHandler={handleGetDeliveries}
        />
      ) : null}
    </>
  );
};

export default GetDeliveriesButton;
