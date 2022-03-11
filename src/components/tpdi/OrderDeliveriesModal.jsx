import React from 'react';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { usePaginatedData } from '../../utils/hooks';
import Pagination from '../common/Pagination';
import Tooltip from '../common/Tooltip/Tooltip';
import BaseModal from './BaseModal';

const PlanetDeliveryInfo = ({ deliveries }) => {
  return (
    <table className="primary-table w-full">
      <thead className="primary-table__header">
        <tr>
          <th>Id</th>
          <th>Item Id</th>
          <th>Sq Km</th>
          <th>Status</th>
          <th>Sensing Instrument</th>
          <th>Harmonized To Instrument</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody className="primary-table__body">
        {deliveries.length === 0 ? (
          <tr>
            <td colSpan={4}>Deliveries not found</td>
          </tr>
        ) : (
          deliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td>{delivery.id}</td>
              <td>{delivery.itemId}</td>
              <td>{delivery.sqkm}</td>
              <td>{delivery.status}</td>
              <td>{delivery.sensingInstrument}</td>
              <td>{delivery.harmonizedToInstrument}</td>
              <td>
                {delivery.errorMessage ? <Tooltip content={delivery.errorMessage} direction="right" /> : '-'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
const AirbusDeliveryInfo = ({ deliveries }) => {
  return (
    <table className="primary-table w-full">
      <thead className="primary-table__header">
        <tr>
          <th>Id</th>
          <th>Product Id</th>
          <th>Sq Km</th>
          <th>Status</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody className="primary-table__body">
        {deliveries.length === 0 ? (
          <tr>
            <td colSpan={4}>Deliveries not found</td>
          </tr>
        ) : (
          deliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td>{delivery.id}</td>
              <td>{delivery.productId}</td>
              <td>{delivery.sqkm}</td>
              <td>{delivery.status}</td>
              <td>
                {delivery.errorMessage ? <Tooltip content={delivery.errorMessage} direction="right" /> : '-'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

const MaxarDeliveryInfo = ({ deliveries }) => {
  return (
    <table className="primary-table w-full">
      <thead className="primary-table__header">
        <tr>
          <th>Id</th>
          <th>Sq Km</th>
          <th>Status</th>
          <th>Selected Images</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody className="primary-table__body">
        {deliveries.length === 0 ? (
          <tr>
            <td colSpan={4}>Deliveries not found</td>
          </tr>
        ) : (
          deliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td>{delivery.id}</td>
              <td>{delivery.sqkm}</td>
              <td>{delivery.status}</td>
              <td>{delivery.selectedImages ? delivery.selectedImages.join(', ') : '-'}</td>
              <td>
                {delivery.errorMessage ? <Tooltip content={delivery.errorMessage} direction="right" /> : '-'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

const OrderDeliveriesTable = ({ orderId, provider }) => {
  const { currentPage, hasError, isFetching, maxPage, setPage, results: deliveries } = usePaginatedData(
    ({ viewtoken }) =>
      TpdiResource.getDeliveries(
        { orderId },
        {
          params: {
            viewtoken,
          },
        },
      ),
    [],
    'created:desc',
  );
  if (isFetching) {
    return (
      <p style={{ width: '600px' }} className="h-96">
        Fetching...
      </p>
    );
  }
  if (hasError) {
    return <p>Something went wrong fetching deliveries</p>;
  }

  return (
    <div style={{ width: '600px' }} className="overflow-y-scroll h-96 mr-4">
      <Pagination currentPage={currentPage} maxPage={maxPage} setPage={setPage} />
      {(() => {
        switch (provider) {
          case 'AIRBUS':
            return <AirbusDeliveryInfo deliveries={deliveries} />;
          case 'MAXAR':
            return <MaxarDeliveryInfo deliveries={deliveries} />;
          case 'PLANET':
            return <PlanetDeliveryInfo deliveries={deliveries} />;
          default:
            return <p>Provider not supported on the app!</p>;
        }
      })()}
    </div>
  );
};

const OrderDeliveriesModal = ({ orderId, provider }) => {
  return (
    <BaseModal
      trigger={<button className="underline-button ml-2">Deliveries</button>}
      content={() => <OrderDeliveriesTable orderId={orderId} provider={provider} />}
    />
  );
};

export default OrderDeliveriesModal;
