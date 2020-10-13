import React, { useState } from 'react';
import store, { tpdiSlice, requestSlice } from '../../store';
import RequestButton from '../common/RequestButton';
import { deleteTPDIOrder, confirmTPDIOrder } from './generateTPDIRequests';
import { getTransformedGeometryFromBounds, focusMap } from '../common/Map/utils/crsTransform';
import GetDeliveriesButton from './GetDeliveriesButton';
import { parseTPDIRequest } from './parse';

const OrderInfo = ({ token, order, handleDeleteOrder, handleUpdateOrder }) => {
  const [expandOrder, setExpandOrder] = useState(false);
  const [deliveries, setDeliveries] = useState([]);

  const handleSeeGeometry = () => {
    const transformedGeo = getTransformedGeometryFromBounds(order.input.bounds);
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(transformedGeo));
    focusMap();
  };

  const handleSetGeometry = () => {
    const transformedGeo = getTransformedGeometryFromBounds(order.input.bounds);
    store.dispatch(requestSlice.actions.setGeometry(transformedGeo));
    focusMap();
  };

  const handleConfirm = (response) => {
    handleUpdateOrder(response);
  };

  const handleDeleteClick = async () => {
    try {
      const res = await deleteTPDIOrder(token, order.id);
      if (res.status === 204) {
        handleDeleteOrder(order.id);
      }
    } catch (err) {
      console.error('Cannot delete order', err);
    }
  };

  const handleSetExpandOrder = () => {
    setExpandOrder(!expandOrder);
  };

  const handleParseRequest = () => {
    parseTPDIRequest(order);
  };

  return (
    <div className="order-info">
      <label onClick={handleSetExpandOrder} className="form__label">
        {order.id} - {order.name ? order.name + ' -' : null}{' '}
        {order.created ? order.created.replace('T', ' ').slice(0, -8) : null} -{' '}
        {expandOrder ? String.fromCharCode(0x25b2) : String.fromCharCode(0x25bc)}
      </label>
      {expandOrder ? (
        <div className="u-margin-bottom-small">
          {order.name ? (
            <p className="text">
              <span>Name: </span>
              {order.name}
            </p>
          ) : null}
          <p className="text">
            <span>Provider: </span>
            {order.provider}
          </p>
          <p className="text">
            <span>Status: </span>
            {order.status}
          </p>
          <p className="text">
            <span>SqKm: </span>
            {order.sqkm}
          </p>
          {order.collectionId ? (
            <p className="text">
              <span>Collection Id: </span>
              {order.collectionId}
            </p>
          ) : null}
          <p className="text">
            <span>Created at: </span>
            {order.created}
          </p>
          {deliveries.length > 0 ? (
            <>
              <p className="text">
                <span>Deliveries: </span>
                {deliveries.map((del, idx) => {
                  if (idx === deliveries.length - 1) {
                    return del.status;
                  }
                  return del.status + ', ';
                })}
              </p>
            </>
          ) : null}
          <button className="secondary-button" onClick={handleSeeGeometry}>
            See on map
          </button>
          <button className="secondary-button" onClick={handleSetGeometry}>
            Set geometry on map
          </button>
          <button className="secondary-button" onClick={handleParseRequest}>
            Parse Request
          </button>
          {order.status !== 'DONE' && order.status !== 'RUNNING' ? (
            <RequestButton
              request={confirmTPDIOrder}
              args={[token, order.id]}
              buttonText="Confirm Order"
              className="secondary-button"
              validation={Boolean(token)}
              responseHandler={handleConfirm}
            />
          ) : null}
          <button className="secondary-button secondary-button--cancel" onClick={handleDeleteClick}>
            Delete Order
          </button>
          <GetDeliveriesButton
            id={order.id}
            token={token}
            status={order.status}
            setDeliveries={setDeliveries}
          />
        </div>
      ) : null}
    </div>
  );
};

export default OrderInfo;
