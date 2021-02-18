import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import store from '../../store';
import tpdiSlice from '../../store/tpdi';
import RequestButton from '../common/RequestButton';
import { deleteTPDIOrder, confirmTPDIOrder } from './generateTPDIRequests';
import { getTransformedGeometryFromBounds, focusMap } from '../common/Map/utils/crsTransform';
import GetDeliveriesButton from './GetDeliveriesButton';
import { parseTPDIRequest } from './parse';
import Tooltip from '../common/Tooltip/Tooltip';
import { getFormattedDatetime } from './utils';
import { formatNumber } from '../../utils/const';

const getColorByStatus = (status) => {
  if (status === 'PARTIAL') {
    return '#f39c12';
  }
  if (status === 'FAILED') {
    return '#c0392b';
  }
  return undefined;
};
const TooltipInfo = ({ isGeneral }) => {
  return (
    <div>
      {isGeneral ? (
        <p className="text">To see all possible options expand the order by clicking on the title</p>
      ) : (
        <p className="text">Your order is ready and needs to be confirmed to be completed.</p>
      )}
      <p className="text">See "Requested Quota" for the quota your order will use, when confirmed.</p>
      <p className="text">To proceed, click the "Confirm Order" button.</p>
      <p className="text">To delete an order, click the "Delete Order" button.</p>
      <p className="text">To parse the geometry of the order and see it on a map, click "See on map".</p>
      <p className="text">To parse the whole request (use its data to update UI), click "Update UI"</p>
      <p className="text">To see the status of the all the order's deliveries, click on "Get Deliveries"</p>
      <br />
      <p className="text">
        When you click on "Confirm Order", the collection ID will be created in your Dashboard and order
        STATUS will display CREATED.
      </p>
      <p className="text">
        When order STATUS displays DONE, the tiles will be successfully ingested into your collection.
      </p>
      <br />
      {isGeneral && (
        <p className="text">
          Orders are grouped by status (Created, running and done). Once an order finishes or gets confirmed
          it will automatically move to the appropiate section
        </p>
      )}
    </div>
  );
};

export const OrdersTooltip = ({ isGeneral = false }) => (
  <Tooltip direction="bottom" content={<TooltipInfo isGeneral={isGeneral} />} width="400px" />
);

const OrderInfo = ({ token, order, handleDeleteOrder, handleUpdateOrder, expandOrder, updateToFinished }) => {
  const [deliveries, setDeliveries] = useState([]);
  const handleSeeGeometry = () => {
    const transformedGeo = getTransformedGeometryFromBounds(order.input.bounds);
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(transformedGeo));
    focusMap();
  };

  const handleConfirm = (response) => {
    handleUpdateOrder(response);
  };

  const handleDelete = (res) => {
    handleDeleteOrder(order.id);
  };

  const handleSetExpandOrder = () => {
    expandOrder(order.id);
  };

  const handleParseRequest = () => {
    parseTPDIRequest(order);
  };

  return (
    <div className="order-info">
      <div className="tpdi-feature-title">
        <div
          onClick={handleSetExpandOrder}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '50%',
            color: getColorByStatus(order.status),
            cursor: 'pointer',
          }}
        >
          <p className="text">
            {order.name && <span>{order.name} -</span>}
            {getFormattedDatetime(order.created)}
          </p>
          {order.isExpanded ? (
            <FontAwesomeIcon className="icon" icon={faAngleDoubleUp} />
          ) : (
            <FontAwesomeIcon className="icon" icon={faAngleDoubleDown} />
          )}
        </div>
      </div>
      {order.isExpanded ? (
        <div className="order-info-extra-info">
          {order.name ? (
            <p className="text">
              <span>Name: </span>
              {order.name}
            </p>
          ) : null}
          <p className="text">
            <span>Id: </span>
            {order.id}
          </p>
          <p className="text">
            <span>Provider: </span>
            {order.provider}
          </p>
          <p className="text">
            <span>Status: </span>
            {order.status}
          </p>
          <p className="text">
            <span>Size: </span>
            {formatNumber(order.sqkm, 3)}km<sup>2</sup>
          </p>
          {order.collectionId ? (
            <p className="text">
              <span>Collection Id: </span>
              {order.collectionId}
            </p>
          ) : null}
          <p className="text">
            <span>Created at: </span>
            {getFormattedDatetime(order.created)}
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
          <div className="u-flex-aligned">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                width: '50%',
                columnGap: '1rem',
                marginRight: '1rem',
              }}
            >
              {order.status !== 'DONE' && order.status !== 'RUNNING' && (
                <RequestButton
                  request={confirmTPDIOrder}
                  args={[token, order.id]}
                  buttonText="Confirm Order"
                  className="secondary-button"
                  validation={Boolean(token)}
                  responseHandler={handleConfirm}
                  useConfirmation={true}
                  dialogText="Are you sure you want to confirm this order?"
                />
              )}
              <button className="secondary-button" onClick={handleSeeGeometry}>
                See on map
              </button>
              {order.status !== 'RUNNING' && (
                <RequestButton
                  request={deleteTPDIOrder}
                  args={[token, order.id]}
                  buttonText="Delete order"
                  className="secondary-button secondary-button--cancel"
                  responseHandler={handleDelete}
                  useConfirmation={true}
                  dialogText="Are you sure you want to delete this order?"
                  validation={true}
                />
              )}
              <button className="secondary-button" onClick={handleParseRequest}>
                Update UI
              </button>
              <GetDeliveriesButton
                id={order.id}
                token={token}
                status={order.status}
                setDeliveries={setDeliveries}
                updateToFinished={updateToFinished}
              />
            </div>

            <OrdersTooltip />
          </div>
        </div>
      ) : null}
      <hr />
    </div>
  );
};

export default OrderInfo;
