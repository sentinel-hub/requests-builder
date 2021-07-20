import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import store from '../../store';
import RequestButton from '../common/RequestButton';
import { getTransformedGeometryFromBounds, focusMap } from '../common/Map/utils/crsTransform';
import GetDeliveriesButton from './GetDeliveriesButton';
import { parseTPDIRequest } from './parse';
import Tooltip from '../common/Tooltip/Tooltip';
import { getFormattedDatetime } from './utils';
import { CUSTOM } from '../../utils/const/const';
import mapSlice from '../../store/map';
import requestSlice from '../../store/request';
import { dispatchBounds } from '../process/requests/parseRequest';
import { addSuccessAlert, addWarningAlert } from '../../store/alert';
import CopyIcon from '../common/CopyIcon';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { formatNumber } from '../../utils/commonUtils';
import { getMessageFromApiError } from '../../api';

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
    store.dispatch(mapSlice.actions.setExtraGeometry(transformedGeo));
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

  const handleRequestProcess = () => {
    try {
      store.dispatch(requestSlice.actions.resetState({ resetMode: true }));
      store.dispatch(requestSlice.actions.setDataCollection({ dataCollection: CUSTOM, idx: 0 }));
      store.dispatch(requestSlice.actions.setByocCollectionId({ id: order.collectionId, idx: 0 }));
      store.dispatch(requestSlice.actions.setByocCollectionType({ idx: 0, type: 'BYOC' }));
      store.dispatch(requestSlice.actions.disableTimerange(true));
      store.dispatch(requestSlice.actions.setEvalscript('// Write your evalscript'));
      dispatchBounds(order);
      addSuccessAlert('Order successfully parsed.\nRemember to set an appropiate evalscript!');
    } catch (err) {
      addWarningAlert('Something went wrong, check the console to see more details');
      console.error(err);
    }
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
            <CopyIcon style={{ marginLeft: '1rem' }} item={order.id} />
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
          <div className="flex items-center">
            <div className="grid grid-cols-2 w-2/3 gap-2 mr-2">
              {order.status !== 'DONE' && order.status !== 'RUNNING' && (
                <RequestButton
                  request={TpdiResource.confirmOrder}
                  args={[{ orderId: order.id }]}
                  buttonText="Confirm Order"
                  className="secondary-button"
                  validation={Boolean(token)}
                  responseHandler={handleConfirm}
                  useConfirmation={true}
                  dialogText="Are you sure you want to confirm this order?"
                  errorHandler={(err) => {
                    addWarningAlert(getMessageFromApiError(err));
                  }}
                />
              )}
              <button className="secondary-button" onClick={handleSeeGeometry}>
                See on map
              </button>
              {order.status !== 'RUNNING' && (
                <RequestButton
                  request={TpdiResource.deleteOrder}
                  args={[{ orderId: order.id }]}
                  buttonText="Delete order"
                  className="secondary-button secondary-button--cancel"
                  responseHandler={handleDelete}
                  useConfirmation={true}
                  dialogText="Are you sure you want to delete this order?"
                  validation={true}
                  errorHandler={(err) => {
                    addWarningAlert(getMessageFromApiError(err));
                  }}
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
              {order.status === 'DONE' && (
                <button className="secondary-button secondary-button--wrapped" onClick={handleRequestProcess}>
                  Request on Process API
                </button>
              )}
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
