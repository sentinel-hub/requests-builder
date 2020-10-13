import React from 'react';
import RequestButton from '../common/RequestButton';
import { getAllDeliveries } from './generateTPDIRequests';

const GetDeliveriesButton = ({ id, token, status, setDeliveries }) => {
  const handleGetDeliveries = (response) => {
    setDeliveries(response.data);
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
