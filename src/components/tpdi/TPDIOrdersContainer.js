import React, { useState } from 'react';
import RequestButton from '../RequestButton';
import { getAllTPDIOrders } from './generateTPDIRequests';
import { errorHandlerTPDI } from './TPDIOrderOptions';
import OrderInfo from './OrderInfo';

import { connect } from 'react-redux';

const TPDIOrdersContainer = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const handleGetOrders = (response) => {
    setOrders(response.data.sort((a, b) => new Date(b.created) - new Date(a.created)));
  };

  const handleDeleteOrder = (orderId) => {
    const newOrders = orders.filter((order) => order.id !== orderId);
    setOrders(newOrders);
  };

  const handleUpdateOrder = (newOrder) => {
    const index = orders.findIndex((order) => order.id === newOrder.id);
    const newOrders = orders
      .slice(0, index)
      .concat(newOrder)
      .concat(orders.slice(index + 1));
    setOrders(newOrders);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 className="heading-secondary">Orders</h2>
      <div className="form" style={{ overflowY: 'scroll', maxHeight: '450px' }}>
        <div className="u-margin-bottom-small">
          <RequestButton
            request={getAllTPDIOrders}
            args={[token]}
            buttonText={orders.length > 0 ? 'Refresh your orders' : 'Get your orders'}
            validation={Boolean(token)}
            className={'secondary-button'}
            responseHandler={handleGetOrders}
            disabledTitle="Log in to use this"
            errorHandler={errorHandlerTPDI}
          />
        </div>
        {orders.length > 0
          ? orders.map((order) => (
              <OrderInfo
                handleDeleteOrder={handleDeleteOrder}
                handleUpdateOrder={handleUpdateOrder}
                token={token}
                key={order.id}
                order={order}
              />
            ))
          : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TPDIOrdersContainer);
