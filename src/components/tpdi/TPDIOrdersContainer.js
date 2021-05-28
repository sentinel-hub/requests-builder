import React, { useEffect, useRef } from 'react';
import RequestButton from '../common/RequestButton';
import { errorHandlerTPDI } from './TPDIOrderOptions';
import OrderInfo, { OrdersTooltip } from './OrderInfo';

import { connect } from 'react-redux';
import { groupBy } from '../../utils/const';
import OverlayButton from '../common/OverlayButton';
import TpdiResource from '../../api/tpdi/TpdiResource';

const groupAggregator = (el) => {
  if (el.status === 'PARTIAL' || el.status === 'DONE' || el.status === 'FAILED') {
    return 'FINISHED';
  }
  return el.status;
};

const TPDIOrdersContainer = ({ token, setGetOrdersResponse, orders, setOrders }) => {
  const containerRef = useRef();
  const runningRef = useRef();
  const finishedRef = useRef();

  const handleGetOrders = (response) => {
    setOrders((prevOrders) => {
      return response.data
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .map((ord) => {
          // Used to keep expanded state.
          const prevOrder = prevOrders.find((prevOrder) => prevOrder.id === ord.id);
          let expanded = false;
          if (prevOrder) {
            expanded = prevOrder.isExpanded;
          }
          return { ...ord, isExpanded: expanded };
        });
    });
    setGetOrdersResponse(JSON.stringify(response.data, null, 2));
  };

  const handleDeleteOrder = (orderId) => {
    const newOrders = orders.filter((order) => order.id !== orderId);
    setOrders(newOrders);
  };

  const handleUpdateOrder = (newOrder) => {
    const index = orders.findIndex((order) => order.id === newOrder.id);
    let newOrders = orders
      .slice(0, index)
      .concat(newOrder)
      .concat(orders.slice(index + 1));
    if (newOrder.status === 'RUNNING') {
      newOrders = newOrders.map((order) => {
        if (order.id === newOrder.id) {
          return { ...order, isExpanded: true };
        }
        return order;
      });
      runningRef.current.scrollIntoView();
    }
    setOrders(newOrders);
  };

  const expandOrder = (id) => {
    const index = orders.findIndex((order) => order.id === id);
    const newOrders = orders
      .slice(0, index)
      .concat({ ...orders[index], isExpanded: !orders[index].isExpanded })
      .concat(orders.slice(index + 1));
    setOrders(newOrders);
  };

  const updateToFinished = (id) => {
    const index = orders.findIndex((order) => order.id === id);
    const newOrders = orders
      .slice(0, index)
      .concat({ ...orders[index], isExpanded: true, status: 'DONE' })
      .concat(orders.slice(index + 1));
    setOrders(newOrders);
    finishedRef.current.scrollIntoView();
  };

  // Scroll to top whenever orders.length change (order added)
  useEffect(() => {
    containerRef.current.scrollTop = 0;
  }, [orders.length]);

  const { FINISHED, CREATED, RUNNING } = groupBy(orders, groupAggregator);
  return (
    <>
      <div className="u-expand-title">
        <div className="u-flex-aligned" style={{ marginBottom: '0.5rem' }}>
          <h2 className="heading-secondary" style={{ marginRight: '3rem' }}>
            My Orders
          </h2>
          <OrdersTooltip isGeneral />
        </div>
        <OverlayButton elementRef={containerRef} />
      </div>
      <div className="form" style={{ overflowY: 'scroll', maxHeight: '500px' }} ref={containerRef}>
        <div className="u-margin-bottom-small">
          <RequestButton
            request={TpdiResource.getOrders}
            args={[null]}
            buttonText={orders.length > 0 ? 'Refresh your orders' : 'Get your orders'}
            validation={Boolean(token)}
            className={'secondary-button'}
            responseHandler={handleGetOrders}
            disabledTitle="Log in to use this"
            errorHandler={errorHandlerTPDI}
          />
        </div>
        <h3 className="heading-secondary">Created Orders (Not confirmed)</h3>
        <div style={{ marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
          {CREATED === undefined || CREATED.length === 0 ? (
            <p className="text u-margin-bottom-small">No orders found</p>
          ) : (
            CREATED.map((order) => (
              <OrderInfo
                handleDeleteOrder={handleDeleteOrder}
                handleUpdateOrder={handleUpdateOrder}
                token={token}
                key={order.id}
                order={order}
                expandOrder={expandOrder}
                updateToFinished={updateToFinished}
              />
            ))
          )}
        </div>

        <h3 className="heading-secondary">Running Orders</h3>
        <div style={{ marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem' }} ref={runningRef}>
          {RUNNING === undefined || RUNNING.length === 0 ? (
            <p className="text u-margin-bottom-small">No orders found</p>
          ) : (
            RUNNING.map((order) => (
              <OrderInfo
                handleDeleteOrder={handleDeleteOrder}
                handleUpdateOrder={handleUpdateOrder}
                token={token}
                key={order.id}
                order={order}
                expandOrder={expandOrder}
                updateToFinished={updateToFinished}
              />
            ))
          )}
        </div>

        <h3 className="heading-secondary">Finished Orders</h3>
        <div style={{ marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem' }} ref={finishedRef}>
          {FINISHED === undefined || FINISHED.length === 0 ? (
            <p className="text u-margin-bottom-small">No orders found</p>
          ) : (
            FINISHED.map((order) => (
              <OrderInfo
                handleDeleteOrder={handleDeleteOrder}
                handleUpdateOrder={handleUpdateOrder}
                token={token}
                key={order.id}
                order={order}
                expandOrder={expandOrder}
                updateToFinished={updateToFinished}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TPDIOrdersContainer);
